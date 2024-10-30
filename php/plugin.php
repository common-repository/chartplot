<?php

class ChartplotPlugin {

    public $rootFilePath;
    public $tinymceJsScript;

    public function __construct()
    {
        $this->rootFilePath = __DIR__.'/../index.php';
    }

    function register_scripts(){

        $url = plugin_dir_url($this->rootFilePath);

        wp_register_script("echarts", $url."js/echarts/echarts-en.min.js", array(), "4.2.0-rc.1");
        wp_register_script("echarts_theme_infographic", $url."js/echarts/themes/infographic.js", array("echarts"), "4.2.0-rc.1");
        wp_register_script("echarts_theme_macarons", $url."js/echarts/themes/macarons.js", array("echarts"), "4.2.0-rc.1");

        wp_register_script("xlsx", $url."js/xlsx.full.min.js", array(), '0.14.0');
        wp_register_script("papaparse", $url."js/papaparse.min.js", array(), '4.6.3');

        $this->register_chartplot_scripts();


    }

    function register_chartplot_scripts(){

        $url = plugin_dir_url($this->rootFilePath);

        wp_register_script("chartplot_vendor",$url."js/chartplot/vendor.min.js", array("jquery", "echarts"), '1.0.0');
        wp_register_script("chartplot_post",$url."js/chartplot/post.min.js", array("jquery", "echarts", "chartplot_vendor"), '1.0.0');
        wp_register_script("chartplot", $url."js/chartplot/chartplot.min.js", array(), '1.0.0');
    }

    function enqueue_admin_scripts($hook){

        global $post;
        $this->register_scripts();
        $url = plugin_dir_url($this->rootFilePath);

        if ( $hook == 'post-new.php' || $hook == 'post.php' ) {
            if ( 'chartplot_chart' === $post->post_type ) {
                wp_enqueue_media();
                wp_enqueue_script("echarts");
                wp_enqueue_script("echarts_theme_infographic");
                wp_enqueue_script("echarts_theme_macarons");
                wp_enqueue_script("echarts_theme_shine");
                wp_enqueue_script("echarts_theme_vintage");
                wp_enqueue_style("handsontable", $url."css/handsontable.full.css", array(), '0.38.1');
                wp_enqueue_script("xlsx");
                wp_enqueue_script("papaparse");
                wp_enqueue_script("handsontable", $url."js/handsontable.full.min.js", array(), '6.2.2');
                wp_enqueue_script("split", $url."js/split.min.js", array(), '1.3.5');
                wp_enqueue_script("FileSaver", $url."js/FileSaver.min.js", array(), '2.0.0');
                wp_enqueue_style("chartplot_font", $url."img/icons/iconfont.css", array(), '1.0.0');
                wp_enqueue_style("chartplot", $url."css/chartplot.css", array(), '1.0.0');
                wp_enqueue_script("chartplot_vendor", $url."js/chartplot/vendor.min.js", array(), '1.0.0');
                wp_enqueue_script("chartplot");
                wp_localize_script( 'chartplot_vendor', 'chartplot_settings', array(
                    'wordpress_url' =>  $url,
                    'show_tooltips' => (get_option( 'chartplot_show_tooltips', '1' ) === '1') ? "1" : "",
                    'ajaxurl' => admin_url( 'admin-ajax.php' )
                ));
            }
            else{
                add_editor_style($url.'css/tinymce.css' );
                wp_enqueue_style("chartplot", $url."css/chartplot.css", array(), '1.0.0');
                wp_enqueue_style("chartplot_font", $url."img/icons/iconfont.css", array(), '1.0.0');
                wp_enqueue_script("chartplot_vendor", $url."js/chartplot/vendor.min.js", array(), '1.0.0');
                wp_localize_script( 'chartplot_vendor', 'chartplot_settings', array(
                    'wordpress_url' =>  $url,
                    'show_tooltips' => (get_option( 'chartplot_show_tooltips', '1' ) === '1') ? "1" : "",
                    'ajaxurl' => admin_url( 'admin-ajax.php' )
                ));
            }
        }
    }

    function create_chart() {
        $labels = array(
            'name'               => _x( 'Chartplot', 'chartplot' ),
            'singular_name'      => _x( 'Chartplot', 'chartplot' ),
            'menu_name'          => _x( 'Chartplot', 'chartplot' ),
            'name_admin_bar'     => _x( 'Chartplot', 'chartplot' ),
            'add_new'            => _x( 'Add New', 'chartplot' ),
            'add_new_item'       => __( 'Add New Chart', 'chartplot' ),
            'new_item'           => __( 'New Chart', 'chartplot' ),
            'edit_item'          => __( 'Edit Chart', 'chartplot' ),
            'view_item'          => __( 'View Chart', 'chartplot' ),
            'all_items'          => __( 'All Charts', 'chartplot' ),
            'search_items'       => __( 'Search Charts', 'chartplot' ),
            'parent_item_colon'  => __( 'Parent Charts:', 'chartplot' ),
            'not_found'          => __( 'No Charts found.', 'chartplot' ),
            'not_found_in_trash' => __( 'No Charts found in Trash.', 'chartplot' )
        );

        $args = array(
            'labels'             => $labels,
            'description'        => __( 'Chartplot charts.', 'chartplot' ),
            'public'             => true,
            'publicly_queryable' => true,
            'show_ui'            => true,
            'show_in_menu'       => true,
            'query_var'          => true,
            'rewrite'            => array( 'slug' => 'chartplot' ),
            'capability_type'    => 'post',
            'has_archive'        => true,
            'menu_position'      => 20,
            'supports'           => array( 'title', 'author', 'excerpt','thumbnail', 'page-attributes', 'revisions', 'comments'),
            'menu_icon' => 'data:image/svg+xml;base64,' . base64_encode('<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#a0a5aa" d="M0,19.9H9.3A15.16,15.16,0,0,1,19.8,9.3V0A24.34,24.34,0,0,0,0,19.9Z"/><path fill="#a0a5aa" d="M48,24a28.28,28.28,0,0,1-.3,4.1A24.46,24.46,0,0,1,27.9,48V38.7A15.16,15.16,0,0,0,38.4,28.1a15.88,15.88,0,0,0,0-8.1A15.3,15.3,0,0,0,27.9,9.3V0A24.46,24.46,0,0,1,47.7,19.9,28.28,28.28,0,0,1,48,24Z"/><path fill="#a0a5aa" d="M32.8,24A9,9,0,1,1,16,19.5a8.72,8.72,0,0,1,3.3-3.3A9,9,0,0,1,32.8,24Z"/></svg>')
        );

        register_post_type('chartplot_chart', $args );
    }

    function create_chart_taxonomies()
    {
        $labels = array(
            'name' => _x('Categories', 'taxonomy general name'),
            'singular_name' => _x('Category', 'taxonomy singular name'),
            'search_items' => __('Search Categories'),
            'all_items' => __('All Categories'),
            'parent_item' => __('Parent Category'),
            'parent_item_colon' => __('Parent Category:'),
            'edit_item' => __('Edit Category'),
            'update_item' => __('Update Category'),
            'add_new_item' => __('Add New Category'),
            'new_item_name' => __('New Category Name'),
            'menu_name' => __('Categories'),
        );

        $args = array(
            'hierarchical' => true, // Set this to 'false' for non-hierarchical taxonomy (like tags)
            'labels' => $labels,
            'show_ui' => true,
            'show_admin_column' => true,
            'query_var' => true,
            'rewrite' => array('slug' => 'chart-category'),
        );

        register_taxonomy('chartplot_chart_categories', array('chartplot_chart'), $args);

        $labels = array(
            'name' => _x('Tags', 'taxonomy general name'),
            'singular_name' => _x('Tag', 'taxonomy singular name'),
            'search_items' => __('Search Tags'),
            'all_items' => __('All Tags'),
            'parent_item' => __('Parent Tag'),
            'parent_item_colon' => __('Parent Tag:'),
            'edit_item' => __('Edit Tag'),
            'update_item' => __('Update Tag'),
            'add_new_item' => __('Add New Tag'),
            'new_item_name' => __('New Tag Name'),
            'menu_name' => __('Tags'),
        );

        $args = array(
            'hierarchical' => false, // Set this to 'false' for non-hierarchical taxonomy (like tags)
            'labels' => $labels,
            'show_ui' => true,
            'show_admin_column' => true,
            'query_var' => true,
            'rewrite' => array('slug' => 'chart-tag'),
        );

        register_taxonomy('chartplot_chart_tags', array('chartplot_chart'), $args);

    }

    function load_demo_charts(){
        if (get_option( 'chartplot_examples_loaded', '0' ) !== '1')
        {
            $examples = array(
                'eye_color' => 'Eye color (Example)',
                'industrial_robots' => 'Industrial Robots (Example)',
                'financial' => 'Candlestick and indicators (Example)',
                'polls' => 'American election polls 2016 (Example)'
            );
            global $current_user;
            wp_get_current_user();
            foreach($examples as $example => $title){
                $content = base64_encode(file_get_contents(plugin_dir_path($this->rootFilePath)."examples/$example.json"));
                $post_id = wp_insert_post(array(
                    'post_title' => $title,
                    'post_content' => $content,
                    'post_status' => 'publish',
                    'post_author' => $current_user->ID,
                    'post_type' => 'chartplot_chart'
                ));
                $this->save_featured_chartplot_image($post_id, file_get_contents(plugin_dir_path($this->rootFilePath)."examples/$example.base64"));
            }
            update_option('chartplot_examples_loaded', '1');
        }
    }

    function edit_form_after_title($post){
        if( in_array( $post->post_type, array( 'chartplot_chart'))){
            ?>
            <input type="hidden" name="content" id="content" value="<?php echo $post->post_content ?>">
            <input type="hidden" name="featured_image" id="featured_image" value="">
            <div id="chartplot-dashboard" class="chartplot-main">

            </div>
            <?php
        }
    }

    function base64_to_png($base64_string, $output_file) {
        $ifp = fopen( $output_file, 'wb' );
        $data = explode( ',', $base64_string );
        fwrite( $ifp, base64_decode( $data[ 1 ] ) );
        fclose( $ifp );
        return $output_file;
    }

    function save_featured_chartplot_image($post_id, $image){
        $wp_upload_dir = wp_upload_dir();
        $imgFolder = $wp_upload_dir['basedir'].'/chartplot/featured_img/';
        $imgPath = $imgFolder.$post_id.'.png';
        $imgUrl = $wp_upload_dir['baseurl'].'/chartplot/featured_img/'.$post_id.'.png';
        if ( ! file_exists( $imgFolder ) ) {
            wp_mkdir_p($imgFolder);
        }
        $this->base64_to_png($image, $imgPath);
        $wp_filetype = wp_check_filetype($imgPath, null);

        $medias = get_attached_media( $wp_filetype, $post_id );

        if (count($medias) > 0){
            foreach ($medias as $media){
                if ($media->post_title == $post_id){
                    return;
                }
            }
        }

        $attachment = array(
            'post_mime_type' => $wp_filetype['type'],
            'post_title' => $post_id,
            'post_content' => '',
            'post_status' => 'inherit'
        );

        $attach_id = wp_insert_attachment( $attachment, $imgUrl, $post_id );


        require_once(ABSPATH . 'wp-admin/includes/image.php');
        $attach_data = wp_generate_attachment_metadata( $attach_id, $imgUrl );
        wp_update_attachment_metadata( $attach_id, $attach_data );

        update_post_meta($post_id, '_thumbnail_id', $attach_id);
    }

    function save_featured_image( $post_id, $post, $update ) {
        $post_type = get_post_type($post_id);
        if ( "chartplot_chart" != $post_type ) return;
        if (get_option( 'chartplot_create_featured_image', '1' ) !== '1') return;
        if ( isset( $_POST['featured_image'] ) ) {
            $this->save_featured_chartplot_image($post_id, sanitize_text_field($_POST['featured_image']));
        }
    }


    function rewrite_flush() {
        add_option( 'chartplot_activated_plugin', '1' );
        $this->create_chart();
        flush_rewrite_rules();
    }

    function remove_attachment_with_post($post_id)
    {
        $post_type = get_post_type($post_id);
        if ( "chartplot_chart" != $post_type ) return;
        if (get_option( 'chartplot_create_featured_image', '1' ) !== '1') return;

        if(has_post_thumbnail( $post_id ))
        {
            $attachment_id = get_post_thumbnail_id( $post_id );
            wp_delete_attachment($attachment_id, true);
        }

    }

    function image_column( $columns ) {
        $columns['chartplot_image'] = 'Image';
        return $columns;
    }

    function image_column_data( $column, $post_id ) {

        switch ( $column ) {
            case 'chartplot_image':
                the_post_thumbnail( 'thumbnail' );
                break;
        }
    }

    function register_tinymce_buttons( $buttons ) {
        array_push( $buttons, 'chartplot_mce_button' );
        return $buttons;
    }

    function register_tinymce_javascript( $plugin_array ) {
        $plugin_array['chartplot_mce_button'] = plugins_url( $this->tinymceJsScript, $this->rootFilePath);
        return $plugin_array;
    }

    function gutenberg_block() {
        wp_register_script( 'chartplot_tinymce',
            plugins_url($this->tinymceJsScript,$this->rootFilePath ),
            array( 'wp-blocks', 'wp-element')
        );
        register_block_type( 'chartplot/chart', array(
            'editor_script' => 'chartplot_tinymce',
            'render_callback' => array($this, 'shortcode')
        ) );
    }

    /**
     * Queries the charts when selecting chart in gutenberg or classic editor.
     */
    function query_charts() {
        $query_args = array('post_type' => 'chartplot_chart',
            'posts_per_page' => intval($_POST['posts_per_page']),
            'paged' => intval($_POST['paged']),
            's' => sanitize_text_field($_POST['query']),
            'perm' => 'readable'
        );
        $query = new WP_Query($query_args);
        $response = array(
            settings => array(
                width => get_option( 'chartplot_chart_width', '100%' ),
                height => get_option('chartplot_chart_height', '500px')
            )
        );
        if ($query->have_posts()){
            $response['post_count'] = $query->post_count;
            $response['found_posts'] = $query->found_posts;
            $response['max_num_pages'] = $query->max_num_pages;
            $resPosts = array();
            while($query->have_posts()){
                $query->the_post();
                $resPost = array();
                global $post;
                $resPost['title'] = $post->post_title;
                $resPost['author'] = get_the_author();
                $resPost['date'] = $post->post_date;
                $resPost['id'] = $post->ID;
                $resPost['image'] =  get_the_post_thumbnail_url($post);

                array_push($resPosts, $resPost);
            }
            $response['charts'] = $resPosts;
        }
        else{
            $response['post_count'] = 0;
            $response['found_posts'] = 0;
            $response['max_num_pages'] = 0;
            $response['charts'] = array();
        }
        echo wp_json_encode($response);
        die();
    }

    function get_chart(){
        $id = intval($_POST['id']);
        $query_args = array(
            'post_type' => 'chartplot_chart',
            'posts_per_page' => 1,
            'perm' => 'readable',
            'p' => $id
        );
        $query = new WP_Query($query_args);
        $response = array(
            settings => array(
                width => get_option( 'chartplot_chart_width', '100%' ),
                height => get_option('chartplot_chart_height', '500px')
            )
        );
        if ($query->have_posts()){
            $query->the_post();
            global $post;
            $response['content'] = $post->post_content;
            $response['title'] = $post->post_title;
            $response['image'] = get_the_post_thumbnail_url($post);
            $response['id'] = $id;
        }
        echo wp_json_encode($response);
        die();
    }

    function shortcode($atts){

        static $ids = 0;
        $ids++;

        extract(shortcode_atts( array(

        ), $atts));

        wp_enqueue_script( 'chartplot_post' );

        $chartId = intval($atts['id']);

        $chart = get_post($chartId);
        if (!$chart){
            return;
        }
        $content = $chart->post_content;
        $contentJson = json_decode(base64_decode($content), false);
        $style = "";
        if ($atts['width']){
            $style = $style."width: ".sanitize_text_field($atts['width']).";";
        }
        if ($atts['height']){
            $style = $style." height: ".sanitize_text_field($atts['height']).";";
        }
        if (property_exists($contentJson, "options") &&
            property_exists($contentJson->options, "chart") &&
            property_exists($contentJson->options->chart, "theme")){
            $theme = $contentJson->options->chart->theme;
        }
        else{
            $theme = "default";
        }
        switch($theme){
            case "infographic":
                wp_enqueue_script("echarts_theme_infographic");
                break;
            case "macarons":
                wp_enqueue_script("echarts_theme_macarons");
                break;
            default:
                break;
        }
        ob_start();
        ?>
        <div id="chartplot_<?php echo $ids ?>" style="<?php echo esc_attr($style)?>"></div>
        <script type="text/javascript">
            if (!window.chartplot_charts){
                window.chartplot_charts = [];
            }
            window.chartplot_charts.push({
                theme: '<?php echo esc_attr($theme)?>',
                config: <?php echo wp_json_encode($contentJson->echart) ?>,
                id: 'chartplot_<?php echo $ids ?>',
                chartplot_id: <?php echo $chartId ?>
            });
        </script>
        <?php
        return ob_get_clean();

    }

    function options_content(){
        ?>
        <div class="wrap">
            <h1>Chartplot settings</h1>
            <form method="post" action="options.php">
                <?php
                settings_fields( 'chartplot' );
                do_settings_sections( 'chartplot' );
                ?>
                <table class="form-table">
                    <tr valign="top">
                        <th scope="row">Create featured image</th>
                        <td>
                            <input type="checkbox" name="chartplot_create_featured_image" value="1" <?php checked( '1', get_option( 'chartplot_create_featured_image', '1' ) ); ?> />
                            <p class="description">Whether to create a featured image whenever you save a chart.
                                Images will be stored in the media library and automatically removed when the chart is deleted.</p>
                        </td>
                    </tr>
                    <tr valign="top">
                        <th scope="row">Show tooltips</th>
                        <td>
                            <input type="checkbox" name="chartplot_show_tooltips" value="1" <?php checked( '1', get_option( 'chartplot_show_tooltips', '1' ) ); ?> />
                            <p class="description">Whether by default tooltips should be showed in the chart editor.</p>
                        </td>
                    </tr>
                    <tr valign="top">
                        <th scope="row">Chart width</th>
                        <td>
                            <input type="text" name="chartplot_chart_width" value="<?php echo sanitize_text_field(get_option( 'chartplot_chart_width', '100%' )) ?>" />
                            <p class="description">The default chart width setting when adding a chart in a post.</p>
                        </td>
                    </tr>
                    <tr valign="top">
                        <th scope="row">Chart height</th>
                        <td>
                            <input type="text" name="chartplot_chart_height" value="<?php echo sanitize_text_field(get_option( 'chartplot_chart_height', '500px' )) ?>" />
                            <p class="description">The default chart height setting when adding a chart in a post.</p>
                        </td>
                    </tr>
                </table>
                <?php submit_button(); ?>
            </form>
        </div>
        <?php
    }

    function sanitize0Or1Option($val){
        if ($val === '1'){
            return '1';
        }
        return '0';
    }

    function options_settings() {
        register_setting( 'chartplot', 'chartplot_create_featured_image', array('sanitize_callback' => array($this, 'sanitize0Or1Option')));
        register_setting( 'chartplot', 'chartplot_chart_width', array('sanitize_callback' => 'sanitize_text_field') );
        register_setting( 'chartplot', 'chartplot_chart_height', array('sanitize_callback' => 'sanitize_text_field') );
        register_setting( 'chartplot', 'chartplot_show_tooltips', array('sanitize_callback' => array($this, 'sanitize0Or1Option')));
    }

    function register_settings_page(){
        add_submenu_page(
            'edit.php?post_type=chartplot_chart',
            __( 'Settings', 'textdomain' ),
            __( 'Settings', 'textdomain' ),
            'manage_options',
            'chartplot_chart_settings',
            array($this, 'options_content')
        );
    }

    function initTinymceScript(){
        $this->tinymceJsScript = '/js/chartplot/tinymce.min.js';
    }

    public function init(){

        $this->initTinymceScript();
        global $chartplot;

        add_action( 'wp_enqueue_scripts', array($this, 'register_scripts'));
        add_action( 'admin_enqueue_scripts', array($this, 'enqueue_admin_scripts'), 9999, 1 );
        add_action( "init", array($this, "create_chart"));
        add_action( 'init', array($this, 'create_chart_taxonomies'), 0 );

        register_activation_hook( $this->rootFilePath, array($this, 'rewrite_flush'));
        add_action( 'admin_init', array($this, 'load_demo_charts'));

        add_action( 'edit_form_after_title', array($this, 'edit_form_after_title'));
        add_action( 'save_post', array($this, 'save_featured_image'), 10, 3 );
        add_action( 'before_delete_post', array($this, 'remove_attachment_with_post'), 10 );
        add_filter( 'manage_posts_columns' , array($this, 'image_column'));
        add_action( 'manage_chartplot_chart_posts_custom_column' , array($this, 'image_column_data'), 10, 2 );
        add_filter( 'mce_buttons', array($this, 'register_tinymce_buttons'));
        add_filter( 'mce_external_plugins', array($this, 'register_tinymce_javascript'));
        global $wp_version;
        if ( version_compare( $wp_version, '5.0', '>=' ) ) {
            add_action( 'init', array($this, 'gutenberg_block'));
        }
        add_action( 'wp_ajax_chartplot_query_charts', array($this, 'query_charts'));
        add_action( 'wp_ajax_chartplot_get_chart', array($this, 'get_chart'));
        add_shortcode('chartplot', array($this, 'shortcode'));
        add_action('admin_menu', array($this, 'register_settings_page'));
        add_action( 'admin_init', array($this, 'options_settings'));
    }

}

?>