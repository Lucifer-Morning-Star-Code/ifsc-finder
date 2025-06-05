<?php
/**
 * Plugin Name: IFSC Finder
 * Description: Single Page IFSC Code Finder using Razorpay IFSC API.
 * Version: 1.0.0
 * Author: Codex
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Enqueue plugin assets when shortcode is used.
 */
function ifsc_finder_enqueue_assets() {
    wp_enqueue_style( 'ifsc-finder-style', plugins_url( 'assets/style.css', __FILE__ ), array(), '1.0' );
    wp_enqueue_script( 'ifsc-finder-script', plugins_url( 'assets/script.js', __FILE__ ), array(), '1.0', true );
}

/**
 * Shortcode callback that renders the IFSC finder interface.
 */
function ifsc_finder_render() {
    // Enqueue assets only when shortcode is rendered
    ifsc_finder_enqueue_assets();

    ob_start();
    ?>
    <div class="ifsc-finder-container">
        <div class="ifsc-tabs">
            <button id="by-select-tab" class="active" type="button">Search by Bank</button>
            <button id="by-ifsc-tab" type="button">Search by IFSC Code</button>
        </div>
        <div id="select-search" class="ifsc-search-section active">
            <select id="bank-select">
                <option value="">Select Bank</option>
            </select>
            <select id="state-select" disabled>
                <option value="">Select State</option>
            </select>
            <select id="district-select" disabled>
                <option value="">Select District</option>
            </select>
            <select id="branch-select" disabled>
                <option value="">Select Branch</option>
            </select>
            <button id="select-submit" type="button" disabled>Show IFSC</button>
        </div>
        <div id="ifsc-search" class="ifsc-search-section">
            <input type="text" id="ifsc-input" placeholder="Enter IFSC Code" />
            <button id="ifsc-submit" type="button">Show Details</button>
        </div>
        <div id="error-message"></div>
        <div id="resultOutput"></div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode( 'ifsc_finder', 'ifsc_finder_render' );
