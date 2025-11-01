#!/bin/bash

# GuauMiau Deep Link Testing Script
# This script helps test deep links on iOS and Android simulators/emulators

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to show usage
show_usage() {
    echo "Usage: ./test-deeplinks.sh [platform] [link-type]"
    echo ""
    echo "Platforms:"
    echo "  ios       - Test on iOS simulator"
    echo "  android   - Test on Android emulator"
    echo ""
    echo "Link Types:"
    echo "  auth      - Test authentication links"
    echo "  main      - Test main navigation links"
    echo "  booking   - Test booking details link"
    echo "  all       - Test all links"
    echo ""
    echo "Examples:"
    echo "  ./test-deeplinks.sh ios auth"
    echo "  ./test-deeplinks.sh android all"
}

# Function to test iOS links
test_ios_link() {
    local url=$1
    print_info "Testing iOS: $url"
    xcrun simctl openurl booted "$url"
    sleep 2
}

# Function to test Android links
test_android_link() {
    local url=$1
    print_info "Testing Android: $url"
    adb shell am start -W -a android.intent.action.VIEW -d "$url"
    sleep 2
}

# Authentication links
test_auth_links() {
    local platform=$1

    print_info "Testing Authentication Links..."

    local links=(
        "guaumiau://login"
        "guaumiau://register"
        "guaumiau://forgot-password"
        "guaumiau://reset-password?token=test-token-123"
    )

    for link in "${links[@]}"; do
        if [ "$platform" = "ios" ]; then
            test_ios_link "$link"
        else
            test_android_link "$link"
        fi
    done

    print_success "Authentication links tested!"
}

# Main navigation links
test_main_links() {
    local platform=$1

    print_info "Testing Main Navigation Links..."

    local links=(
        "guaumiau://home"
        "guaumiau://schedule"
        "guaumiau://achievements"
        "guaumiau://profile"
        "guaumiau://settings"
    )

    for link in "${links[@]}"; do
        if [ "$platform" = "ios" ]; then
            test_ios_link "$link"
        else
            test_android_link "$link"
        fi
    done

    print_success "Main navigation links tested!"
}

# Booking links
test_booking_links() {
    local platform=$1

    print_info "Testing Booking Links..."

    local links=(
        "guaumiau://booking/test-booking-123"
        "guaumiau://booking/abc-def-456"
    )

    for link in "${links[@]}"; do
        if [ "$platform" = "ios" ]; then
            test_ios_link "$link"
        else
            test_android_link "$link"
        fi
    done

    print_success "Booking links tested!"
}

# Universal/App Links (HTTPS)
test_https_links() {
    local platform=$1

    print_warning "Testing HTTPS links (requires domain configuration)..."

    local links=(
        "https://guaumiau.app/login"
        "https://guaumiau.app/home"
        "https://guaumiau.app/booking/123"
    )

    for link in "${links[@]}"; do
        if [ "$platform" = "ios" ]; then
            test_ios_link "$link"
        else
            test_android_link "$link"
        fi
    done

    print_success "HTTPS links tested!"
}

# Main script
main() {
    if [ $# -lt 2 ]; then
        print_error "Missing arguments!"
        show_usage
        exit 1
    fi

    local platform=$1
    local link_type=$2

    # Validate platform
    if [ "$platform" != "ios" ] && [ "$platform" != "android" ]; then
        print_error "Invalid platform: $platform"
        show_usage
        exit 1
    fi

    # Check if simulator/emulator is running
    if [ "$platform" = "ios" ]; then
        if ! xcrun simctl list devices | grep -q "Booted"; then
            print_error "No iOS simulator is booted. Please start a simulator first."
            exit 1
        fi
        print_success "iOS Simulator detected!"
    else
        if ! adb devices | grep -q "device$"; then
            print_error "No Android emulator detected. Please start an emulator first."
            exit 1
        fi
        print_success "Android Emulator detected!"
    fi

    echo ""
    print_info "Starting deep link tests on $platform..."
    echo ""

    # Run tests based on link type
    case $link_type in
        auth)
            test_auth_links "$platform"
            ;;
        main)
            test_main_links "$platform"
            ;;
        booking)
            test_booking_links "$platform"
            ;;
        https)
            test_https_links "$platform"
            ;;
        all)
            test_auth_links "$platform"
            echo ""
            test_main_links "$platform"
            echo ""
            test_booking_links "$platform"
            echo ""
            print_warning "Skipping HTTPS links (run with 'https' to test)"
            ;;
        *)
            print_error "Invalid link type: $link_type"
            show_usage
            exit 1
            ;;
    esac

    echo ""
    print_success "All tests completed! 🎉"
    echo ""
    print_info "Check the app to verify navigation worked correctly."
}

# Run main function
main "$@"
