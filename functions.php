<?php
// Add to your WordPress theme's functions.php file

// Enable CORS for frontend applications
function handle_cors_requests() {
    $allowed_origins = array(
        'https://localhost:5173',
        'http://localhost:5173',
        'https://app.dataengineerhub.blog',
        'https://dataengineerhub.blog'
    );
    
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    
    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: " . $origin);
    }
    
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce");
    header("Access-Control-Allow-Credentials: true");
    
    // Handle preflight requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        status_header(200);
        exit();
    }
}
add_action('init', 'handle_cors_requests');

// Add custom meta fields for featured and trending posts
function add_custom_meta_fields() {
    add_meta_box(
        'post-meta-fields',
        'Post Settings',
        'show_custom_meta_fields',
        'post',
        'side'
    );
}
add_action('add_meta_boxes', 'add_custom_meta_fields');

function show_custom_meta_fields($post) {
    wp_nonce_field(basename(__FILE__), 'post_meta_nonce');
    
    $featured = get_post_meta($post->ID, 'featured', true);
    $trending = get_post_meta($post->ID, 'trending', true);
    
    echo '<p>';
    echo '<label for="featured">';
    echo '<input type="checkbox" id="featured" name="featured" value="1" ' . checked(1, $featured, false) . '>';
    echo ' Featured Post</label>';
    echo '</p>';
    
    echo '<p>';
    echo '<label for="trending">';
    echo '<input type="checkbox" id="trending" name="trending" value="1" ' . checked(1, $trending, false) . '>';
    echo ' Trending Post</label>';
    echo '</p>';
}

function save_custom_meta_fields($post_id) {
    if (!isset($_POST['post_meta_nonce']) || !wp_verify_nonce($_POST['post_meta_nonce'], basename(__FILE__))) {
        return;
    }
    
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }
    
    $featured = isset($_POST['featured']) ? '1' : '0';
    $trending = isset($_POST['trending']) ? '1' : '0';
    
    update_post_meta($post_id, 'featured', $featured);
    update_post_meta($post_id, 'trending', $trending);
}
add_action('save_post', 'save_custom_meta_fields');

// Add featured and trending to REST API response
function add_custom_fields_to_rest_api() {
    register_rest_field('post', 'featured', array(
        'get_callback' => function($post) {
            return get_post_meta($post['id'], 'featured', true) === '1';
        }
    ));
    
    register_rest_field('post', 'trending', array(
        'get_callback' => function($post) {
            return get_post_meta($post['id'], 'trending', true) === '1';
        }
    ));
}
add_action('rest_api_init', 'add_custom_fields_to_rest_api');

// Newsletter subscription endpoint
function register_newsletter_endpoint() {
    register_rest_route('wp/v2', '/newsletter/subscribe', array(
        'methods' => 'POST',
        'callback' => 'handle_newsletter_subscription',
        'permission_callback' => '__return_true',
        'args' => array(
            'email' => array(
                'required' => true,
                'validate_callback' => function($param) {
                    return is_email($param);
                }
            )
        )
    ));
}
add_action('rest_api_init', 'register_newsletter_endpoint');

function handle_newsletter_subscription($request) {
    $email = sanitize_email($request->get_param('email'));
    
    if (!is_email($email)) {
        return new WP_Error('invalid_email', 'Invalid email address', array('status' => 400));
    }
    
    // Check if email already exists
    $existing = get_users(array('meta_key' => 'newsletter_subscription', 'meta_value' => $email));
    if (!empty($existing)) {
        return new WP_Error('already_subscribed', 'Email already subscribed', array('status' => 409));
    }
    
    // Save to database (you might want to use a proper newsletter service like Mailchimp)
    global $wpdb;
    $table_name = $wpdb->prefix . 'newsletter_subscribers';
    
    // Create table if it doesn't exist
    $charset_collate = $wpdb->get_charset_collate();
    $sql = "CREATE TABLE IF NOT EXISTS $table_name (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        email varchar(100) NOT NULL,
        subscribed_date datetime DEFAULT CURRENT_TIMESTAMP,
        status varchar(20) DEFAULT 'active',
        PRIMARY KEY (id),
        UNIQUE KEY email (email)
    ) $charset_collate;";
    
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
    
    $result = $wpdb->insert(
        $table_name,
        array(
            'email' => $email,
            'subscribed_date' => current_time('mysql'),
            'status' => 'active'
        )
    );
    
    if ($result === false) {
        return new WP_Error('subscription_failed', 'Failed to subscribe', array('status' => 500));
    }
    
    // Send welcome email (optional)
    $subject = 'Welcome to DataEngineer Hub Newsletter!';
    $message = 'Thank you for subscribing to our newsletter. You will receive weekly insights and updates about data engineering.';
    wp_mail($email, $subject, $message);
    
    return array(
        'success' => true,
        'message' => 'Successfully subscribed to newsletter'
    );
}

// Contact form endpoint
function register_contact_endpoint() {
    register_rest_route('wp/v2', '/contact/submit', array(
        'methods' => 'POST',
        'callback' => 'handle_contact_submission',
        'permission_callback' => '__return_true',
        'args' => array(
            'name' => array('required' => true),
            'email' => array('required' => true),
            'message' => array('required' => true)
        )
    ));
}
add_action('rest_api_init', 'register_contact_endpoint');

function handle_contact_submission($request) {
    $name = sanitize_text_field($request->get_param('name'));
    $email = sanitize_email($request->get_param('email'));
    $message = sanitize_textarea_field($request->get_param('message'));
    
    if (!is_email($email)) {
        return new WP_Error('invalid_email', 'Invalid email address', array('status' => 400));
    }
    
    // Send email to admin
    $admin_email = get_option('admin_email');
    $subject = 'New Contact Form Submission from ' . $name;
    $email_message = "Name: $name\nEmail: $email\n\nMessage:\n$message";
    
    $sent = wp_mail($admin_email, $subject, $email_message, array(
        'From: DataEngineer Hub <noreply@dataengineerhub.blog>',
        'Reply-To: ' . $email
    ));
    
    if (!$sent) {
        return new WP_Error('email_failed', 'Failed to send message', array('status' => 500));
    }
    
    // Send confirmation email to user
    $user_subject = 'Thank you for contacting DataEngineer Hub';
    $user_message = "Hi $name,\n\nThank you for your message. We'll get back to you shortly.\n\nBest regards,\nDataEngineer Hub Team";
    wp_mail($email, $user_subject, $user_message);
    
    return array(
        'success' => true,
        'message' => 'Contact form submitted successfully'
    );
}

// Add support for featured images
add_theme_support('post-thumbnails');

// Increase excerpt length
function custom_excerpt_length($length) {
    return 30;
}
add_filter('excerpt_length', 'custom_excerpt_length');

// Custom excerpt more
function custom_excerpt_more($more) {
    return '...';
}
add_filter('excerpt_more', 'custom_excerpt_more');

// Add category colors (optional)
function add_category_color_field($term) {
    ?>
    <tr class="form-field">
        <th scope="row" valign="top">
            <label for="category_color">Category Color</label>
        </th>
        <td>
            <input type="color" id="category_color" name="category_color" value="<?php echo esc_attr(get_term_meta($term->term_id, 'category_color', true)); ?>" />
            <p class="description">Choose a color for this category</p>
        </td>
    </tr>
    <?php
}
add_action('category_edit_form_fields', 'add_category_color_field');

function save_category_color_field($term_id) {
    if (isset($_POST['category_color'])) {
        update_term_meta($term_id, 'category_color', sanitize_hex_color($_POST['category_color']));
    }
}
add_action('edited_category', 'save_category_color_field');

// Add category color to REST API
function add_category_color_to_rest_api() {
    register_rest_field('category', 'color', array(
        'get_callback' => function($term) {
            return get_term_meta($term['id'], 'category_color', true) ?: '#3B82F6';
        }
    ));
}
add_action('rest_api_init', 'add_category_color_to_rest_api');

// Ensure proper JSON response for API calls
function ensure_json_response($response, $server, $request) {
    if (strpos($request->get_route(), '/wp/v2/') !== false) {
        header('Content-Type: application/json; charset=utf-8');
    }
    return $response;
}
add_filter('rest_pre_serve_request', 'ensure_json_response', 10, 3);