<?php
// UPDATED functions.php for DataEngineer Hub with Cache Invalidation
// Copy this entire code and replace your current functions.php

// Enable CORS for frontend applications
function handle_cors_requests() {
    $allowed_origins = array(
        'https://app.dataengineerhub.blog',
        'https://dataengineerhub.blog'
    );
    
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    
    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: " . $origin);
    } else {
        // For development, allow localhost
        if (strpos($origin, 'localhost') !== false || 
            strpos($origin, 'bolt.new') !== false || 
            strpos($origin, 'staticblitz.com') !== false ||
            strpos($origin, 'stackblitz.com') !== false ||
            strpos($origin, 'local-credent') !== false) {
            header("Access-Control-Allow-Origin: " . $origin);
        }
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

// =================================================================
// CACHE INVALIDATION SYSTEM
// =================================================================

// Function to clear WordPress object cache and external caches
function clear_all_caches() {
    // Clear WordPress object cache
    if (function_exists('wp_cache_flush')) {
        wp_cache_flush();
    }
    
    // Clear any transients related to posts and categories
    delete_transient('category_counts');
    delete_transient('recent_posts');
    
    // Clear database query cache
    global $wpdb;
    $wpdb->flush();
    
    // Log cache clearing
    error_log("🧹 CACHE: All caches cleared");
}

// Hook to clear cache when posts are saved/updated
add_action('save_post', 'clear_cache_on_post_save', 999);
function clear_cache_on_post_save($post_id) {
    if (wp_is_post_revision($post_id)) return;
    clear_all_caches();
    error_log("🧹 CACHE: Cleared cache after post save: $post_id");
}

// Hook to clear cache when categories are updated
add_action('edited_category', 'clear_cache_on_category_update', 999);
add_action('create_category', 'clear_cache_on_category_update', 999);
function clear_cache_on_category_update($term_id) {
    clear_all_caches();
    error_log("🧹 CACHE: Cleared cache after category update: $term_id");
}

// =================================================================
// AUTO CATEGORY ASSIGNMENT SYSTEM - IMPROVED
// =================================================================

// Main auto-categorization function
add_action('save_post', 'auto_assign_categories_on_save', 10, 2);

function auto_assign_categories_on_save($post_id, $post) {
    // Skip if this is an autosave or revision
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (wp_is_post_revision($post_id)) return;
    
    // Only process published posts
    if ($post->post_status !== 'publish') return;
    
    // Only process posts (not pages)
    if ($post->post_type !== 'post') return;
    
    // Avoid infinite loops
    if (get_transient('processing_auto_categories_' . $post_id)) {
        return;
    }
    set_transient('processing_auto_categories_' . $post_id, true, 30);
    
    // Log the start
    error_log("🤖 AUTO-CATEGORIZATION: Starting for post '$post->post_title' (ID: $post_id)");
    
    // Get content for analysis
    $title = $post->post_title;
    $content = $post->post_content;
    $combined_text = strtolower($title . ' ' . $content);
    
    error_log("🤖 AUTO-CATEGORIZATION: Analyzing content (length: " . strlen($combined_text) . " chars)");
    
    // Simple, effective keyword mapping
    $category_mappings = array(
        'snowflake' => array(
            'keywords' => array('snowflake', 'data warehouse', 'warehouse', 'snowpipe', 'snowsight'),
            'min_score' => 1
        ),
        'aws' => array(
            'keywords' => array('aws', 'amazon web services', 's3', 'ec2', 'lambda', 'glue', 'redshift'),
            'min_score' => 1
        ),
        'azure' => array(
            'keywords' => array('azure', 'microsoft azure', 'synapse', 'data factory', 'power bi'),
            'min_score' => 1
        ),
        'sql' => array(
            'keywords' => array('sql', 'query', 'select', 'database', 'mysql', 'postgresql'),
            'min_score' => 1
        ),
        'python' => array(
            'keywords' => array('python', 'pandas', 'numpy', 'jupyter', 'dataframe'),
            'min_score' => 1
        ),
        'airflow' => array(
            'keywords' => array('airflow', 'dag', 'workflow', 'orchestration'),
            'min_score' => 1
        ),
        'dbt' => array(
            'keywords' => array('dbt', 'data build tool', 'transformation', 'analytics engineering'),
            'min_score' => 1
        )
    );
    
    // Find matches
    $categories_to_assign = array();
    $detected_info = array();
    
    foreach ($category_mappings as $category_slug => $config) {
        $score = 0;
        $found_keywords = array();
        
        // Check each keyword
        foreach ($config['keywords'] as $keyword) {
            $count = substr_count($combined_text, $keyword);
            if ($count > 0) {
                $score += $count;
                $found_keywords[] = "$keyword($count)";
            }
        }
        
        error_log("🤖 AUTO-CATEGORIZATION: '$category_slug' score: $score (need {$config['min_score']})");
        
        // If score is high enough, find the WordPress category
        if ($score >= $config['min_score']) {
            $wp_category = get_category_by_slug($category_slug);
            if ($wp_category) {
                $categories_to_assign[] = $wp_category->term_id;
                $detected_info[$category_slug] = array(
                    'score' => $score,
                    'keywords' => $found_keywords,
                    'category_id' => $wp_category->term_id,
                    'category_name' => $wp_category->name
                );
                error_log("🤖 AUTO-CATEGORIZATION: ✅ Will assign '{$wp_category->name}' (ID: {$wp_category->term_id})");
            } else {
                error_log("🤖 AUTO-CATEGORIZATION: ❌ Category '$category_slug' not found in WordPress!");
            }
        }
    }
    
    // Assign categories
    if (!empty($categories_to_assign)) {
        // Remove hook to prevent infinite loop
        remove_action('save_post', 'auto_assign_categories_on_save', 10, 2);
        
        // Set categories
        $result = wp_set_post_categories($post_id, $categories_to_assign, false);
        
        if ($result) {
            $assigned_names = array();
            foreach ($detected_info as $info) {
                $assigned_names[] = $info['category_name'];
            }
            
            error_log("🤖 AUTO-CATEGORIZATION: ✅ SUCCESS! Assigned: " . implode(', ', $assigned_names));
            
            // Mark as auto-categorized
            update_post_meta($post_id, '_auto_categorized', '1');
            update_post_meta($post_id, '_detected_keywords', json_encode($detected_info));
            
            // IMPORTANT: Update category counts manually
            foreach ($categories_to_assign as $term_id) {
                wp_update_term_count_now(array($term_id), 'category');
                error_log("🔄 Updated category count for term ID: $term_id");
            }
            
        } else {
            error_log("🤖 AUTO-CATEGORIZATION: ❌ Failed to set categories");
        }
        
        // Re-add hook
        add_action('save_post', 'auto_assign_categories_on_save', 10, 2);
    } else {
        error_log("🤖 AUTO-CATEGORIZATION: ⚠️ No categories detected");
        
        // Check if post has any categories
        $existing_categories = wp_get_post_categories($post_id);
        if (empty($existing_categories)) {
            error_log("🤖 AUTO-CATEGORIZATION: Post has no categories, assigning 'Uncategorized'");
            $uncategorized = get_category_by_slug('uncategorized');
            if ($uncategorized) {
                remove_action('save_post', 'auto_assign_categories_on_save', 10, 2);
                wp_set_post_categories($post_id, array($uncategorized->term_id), false);
                wp_update_term_count_now(array($uncategorized->term_id), 'category');
                add_action('save_post', 'auto_assign_categories_on_save', 10, 2);
            }
        }
    }
    
    // Cleanup
    delete_transient('processing_auto_categories_' . $post_id);
    
    // Clear all caches to ensure UI updates
    clear_all_caches();
}

// Force category count updates
add_action('wp_insert_post', 'force_update_category_counts', 999);
function force_update_category_counts($post_id) {
    if (wp_is_post_revision($post_id)) return;
    
    $categories = wp_get_post_categories($post_id);
    if (!empty($categories)) {
        wp_update_term_count_now($categories, 'category');
        error_log("🔄 FORCE: Updated category counts for post $post_id");
    }
}

// Add admin meta box to show detection results
add_action('add_meta_boxes', 'add_auto_category_detection_meta_box');

function add_auto_category_detection_meta_box() {
    add_meta_box(
        'auto-category-detection',
        '🤖 Auto Category Detection',
        'auto_category_detection_callback',
        'post',
        'side',
        'default'
    );
}

function auto_category_detection_callback($post) {
    $title = $post->post_title;
    $content = $post->post_content;
    $combined_text = strtolower($title . ' ' . $content);
    
    echo '<div style="padding: 10px;">';
    
    // Show if already auto-categorized
    $auto_categorized = get_post_meta($post->ID, '_auto_categorized', true);
    $detected_keywords = get_post_meta($post->ID, '_detected_keywords', true);
    
    if ($auto_categorized === '1') {
        echo '<div style="background: #d4edda; color: #155724; padding: 8px; border-radius: 4px; margin-bottom: 10px;">';
        echo '✅ <strong>Auto-categorized!</strong>';
        
        if ($detected_keywords) {
            $keywords_data = json_decode($detected_keywords, true);
            if ($keywords_data) {
                echo '<br><small>Detected: ';
                $detected_list = array();
                foreach ($keywords_data as $cat => $info) {
                    $detected_list[] = "{$info['category_name']} (score: {$info['score']})";
                }
                echo implode(', ', $detected_list);
                echo '</small>';
            }
        }
        echo '</div>';
    }
    
    // Simple keyword detection preview
    $keyword_tests = array(
        'Snowflake' => array('snowflake', 'data warehouse', 'warehouse'),
        'AWS' => array('aws', 'amazon web services', 's3', 'lambda'),
        'Azure' => array('azure', 'synapse', 'power bi'),
        'SQL' => array('sql', 'query', 'database'),
        'Python' => array('python', 'pandas', 'jupyter'),
        'Airflow' => array('airflow', 'dag', 'workflow'),
        'dbt' => array('dbt', 'transformation')
    );
    
    echo '<h4>Keyword Detection:</h4>';
    
    $any_detected = false;
    foreach ($keyword_tests as $category => $keywords) {
        $found = array();
        $score = 0;
        
        foreach ($keywords as $keyword) {
            $count = substr_count($combined_text, $keyword);
            if ($count > 0) {
                $found[] = "$keyword($count)";
                $score += $count;
            }
        }
        
        if ($score > 0) {
            $any_detected = true;
            echo "<div style='background: #d4edda; padding: 5px; margin: 2px 0; border-radius: 3px;'>";
            echo "✅ <strong>$category</strong> (score: $score)<br>";
            echo "<small>" . implode(', ', $found) . "</small>";
            echo "</div>";
        }
    }
    
    if (!$any_detected) {
        echo '<div style="background: #fff3cd; padding: 8px; border-radius: 4px;">';
        echo '⚠️ No keywords detected yet.<br>';
        echo '<small>Try including: Snowflake, AWS, Azure, SQL, Python, Airflow, or dbt</small>';
        echo '</div>';
    } else {
        echo '<div style="background: #d1ecf1; padding: 8px; margin-top: 10px; border-radius: 4px;">';
        echo '💡 Categories will be assigned when you publish/update this post.';
        echo '</div>';
    }
    
    // Manual test button with cache clearing
    if ($post->ID) {
        echo '<hr style="margin: 10px 0;">';
        echo '<button type="button" onclick="testAutoCategories(' . $post->ID . ')" class="button button-primary" style="width: 100%;">🔄 Test Categorization</button>';
        echo '<button type="button" onclick="clearAllCaches()" class="button" style="width: 100%; margin-top: 5px;">🧹 Clear Caches</button>';
        
        ?>
        <script>
        function testAutoCategories(postId) {
            if (confirm('Test auto-categorization for this post?')) {
                jQuery.post(ajaxurl, {
                    action: 'manual_categorization',
                    post_id: postId,
                    nonce: '<?php echo wp_create_nonce("manual_categorization_" . $post->ID); ?>'
                }, function(response) {
                    if (response.success) {
                        alert('✅ Success!\n\nAssigned categories:\n' + response.data.categories.join('\n'));
                        location.reload();
                    } else {
                        alert('❌ Error: ' + response.data);
                    }
                }).fail(function() {
                    alert('❌ Request failed. Check console for details.');
                });
            }
        }
        
        function clearAllCaches() {
            if (confirm('Clear all caches? This will refresh the data for the frontend.')) {
                jQuery.post(ajaxurl, {
                    action: 'clear_all_caches',
                    nonce: '<?php echo wp_create_nonce("clear_caches"); ?>'
                }, function(response) {
                    if (response.success) {
                        alert('✅ Caches cleared successfully!');
                    } else {
                        alert('❌ Error clearing caches: ' + response.data);
                    }
                }).fail(function() {
                    alert('❌ Cache clear request failed.');
                });
            }
        }
        </script>
        <?php
    }
    
    echo '</div>';
}

// AJAX handler for manual categorization
add_action('wp_ajax_manual_categorization', 'handle_manual_categorization');

function handle_manual_categorization() {
    $post_id = intval($_POST['post_id']);
    $nonce = $_POST['nonce'];
    
    if (!wp_verify_nonce($nonce, 'manual_categorization_' . $post_id)) {
        wp_send_json_error('Security check failed');
        return;
    }
    
    if (!current_user_can('edit_post', $post_id)) {
        wp_send_json_error('Insufficient permissions');
        return;
    }
    
    $post = get_post($post_id);
    if (!$post) {
        wp_send_json_error('Post not found');
        return;
    }
    
    // Clear any locks
    delete_transient('processing_auto_categories_' . $post_id);
    
    // Trigger categorization
    auto_assign_categories_on_save($post_id, $post);
    
    // Get results
    $categories = get_the_category($post_id);
    $category_names = array_map(function($cat) { return $cat->name; }, $categories);
    
    // Clear all caches after manual categorization
    clear_all_caches();
    
    wp_send_json_success(array(
        'message' => 'Categories updated and caches cleared',
        'categories' => $category_names,
        'post_title' => $post->post_title
    ));
}

// AJAX handler for cache clearing
add_action('wp_ajax_clear_all_caches', 'handle_clear_all_caches');

function handle_clear_all_caches() {
    $nonce = $_POST['nonce'];
    
    if (!wp_verify_nonce($nonce, 'clear_caches')) {
        wp_send_json_error('Security check failed');
        return;
    }
    
    if (!current_user_can('manage_options')) {
        wp_send_json_error('Insufficient permissions');
        return;
    }
    
    clear_all_caches();
    
    wp_send_json_success(array(
        'message' => 'All caches cleared successfully'
    ));
}

// =================================================================
// END AUTO CATEGORY ASSIGNMENT SYSTEM
// =================================================================

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

// Add fields to REST API
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
    
    register_rest_field('post', 'auto_categorized', array(
        'get_callback' => function($post) {
            return get_post_meta($post['id'], '_auto_categorized', true) === '1';
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
    
    // Save to database
    global $wpdb;
    $table_name = $wpdb->prefix . 'newsletter_subscribers';
    
    // Create table if needed
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
    
    // Send welcome email
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
    
    // Send confirmation to user
    $user_subject = 'Thank you for contacting DataEngineer Hub';
    $user_message = "Hi $name,\n\nThank you for your message. We'll get back to you shortly.\n\nBest regards,\nDataEngineer Hub Team";
    wp_mail($email, $user_subject, $user_message);
    
    return array(
        'success' => true,
        'message' => 'Contact form submitted successfully'
    );
}

// Theme support
add_theme_support('post-thumbnails');

// Excerpt settings
function custom_excerpt_length($length) {
    return 30;
}
add_filter('excerpt_length', 'custom_excerpt_length');

function custom_excerpt_more($more) {
    return '...';
}
add_filter('excerpt_more', 'custom_excerpt_more');

// Category colors
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

// Ensure proper JSON response
function ensure_json_response($response, $server, $request) {
    if (strpos($request->get_route(), '/wp/v2/') !== false) {
        header('Content-Type: application/json; charset=utf-8');
    }
    return $response;
}
add_filter('rest_pre_serve_request', 'ensure_json_response', 10, 3);

// Add cache-busting headers for REST API responses
function add_cache_busting_headers($response, $server, $request) {
    if (strpos($request->get_route(), '/wp/v2/') !== false) {
        $response->header('Cache-Control', 'no-cache, must-revalidate, max-age=0');
        $response->header('Pragma', 'no-cache');
        $response->header('Expires', 'Thu, 01 Jan 1970 00:00:00 GMT');
    }
    return $response;
}
add_filter('rest_post_dispatch', 'add_cache_busting_headers', 10, 3);

?>