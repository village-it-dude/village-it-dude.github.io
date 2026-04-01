// highlight form validation error: adds 'is-invalid' class to input
var highlight = function (input) {
    // Check if the input is a select, checkbox, or radio (your custom logic)

        // For standard input/textarea
        $(input).addClass('error-border').removeClass('is-valid');
   
};

// unhighlight form validation error: removes 'is-invalid' class
var unhighlight = function (input) {

        // For standard input/textarea
        $(input).removeClass('error-border').addClass('is-valid');
    
};

// error placement form validation error: places the error right after the input
var errorPlacement = function (error, element) {
    // Check if the input is inside a direct wrapper (like the <div> added in the HTML)
    // If it is, place the error inside that wrapper for clean layout.
    if (element.parent('div').length) {
        error.insertAfter(element);
    } else {
        // Fallback: place error directly after the element
        error.insertAfter(element);
    }
};

$(document).ready(function() {
    $('#contact-form').validate({
        rules: {
            "entry.358999878": { // Email Field ID
                required: {
                    depends: function () {
                        // Trim value before validation
                        $(this).val($.trim($(this).val()));
                        return true;
                    }
                },
                email: true
            },
            "entry.360297607": { // Name Field ID
                required: true,
            },
            "entry.1084082112": { // Message Field ID
                required: true,
            },
            "entry.498345686":{
                required: true,
                number:true,
                minlength:10,
                maxlength:10
            }
        },
        highlight,
        unhighlight,
        errorPlacement,
        messages: {
            "entry.358999878": {
                required: 'Provide the email',
                email: 'Provide a valid email'
            },
            "entry.360297607": {
                required: "Provide the Name",
            },
            "entry.1084082112": {
                required: "Provide the Message",
            },
                        "entry.498345686":{
                required: "Provide the Phone Number",
                minlength:"Provide a min 10 digit phone number",
                maxlength:"Provide a max 10 digit phone number",
                number:"Provide a valid phone number"
            }
        },
        
        // ------------------------------------------
        // 3. SUBMIT HANDLER (AJAX Submission to Google Forms)
        // ------------------------------------------
        submitHandler: function (form) {
            // Get the submission URL from the HTML form's action attribute
            const formUrl = $(form).attr('action');
            
            // Reference the submit button for UI feedback
            const $btn = $(form).find('.btn');
            const originalBtnValue = $btn.val();

            // Show loading state
            $btn.attr('disabled', 'disabled').val('Sending...');

            // Perform the AJAX submission
            $.ajax({
                url: formUrl,
                data: $(form).serialize(),
                type: 'POST',

                // Use 'complete' because Google Forms often throws a CORS error (Status 0) 
                // but still successfully records the submission.
                complete: function (jqXHR) {
                    
                    // Restore button state
                    $btn.removeAttr('disabled').val(originalBtnValue);
                    
                    // Status 0 (CORS/Redirect) or 200 (Direct Success) usually means it worked
                    if (jqXHR.status === 0 || jqXHR.status === 200) {
                        
                        // SUCCESS UI FEEDBACK
                        // alert('Thank you! Your message has been sent successfully.');
                        // The form's action will handle the actual submission to Google Forms.
                        /* Contact Form */
                       
                        setTimeout(() => {
                            document.getElementById('formSuccess').classList.add('show');
                            setTimeout(() => document.getElementById('formSuccess').classList.remove('show'), 4000);
                        }, 500);
                       
                        
                        // Clear the form fields
                        form.reset(); 
                        
                        // Clear validation classes
                        $('#contact-form input, #contact-form textarea').removeClass('is-valid is-invalid');
                        
                    } else {
                        // ERROR UI FEEDBACK
                        alert('Oops! There was an error sending your message. Please try again.');
                        console.error("AJAX Submission Error Status:", jqXHR.status);
                    }
                }
            });

            // Prevent the default browser form submission (the page reload)
            return false;
        }
    });
    // Smooth scrolling for navigation links
    $('a[href^="#"]').on('click', function(event) {
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;
            $('html, body').animate({
                scrollTop: $(hash).offset().top - 60 // -60 to offset for the fixed header height
            }, 800);
        }
    });

    // Function to check if an element is in the viewport
    function isElementInViewport(el) {
        var rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Trigger Animate.css animations on scroll
    function triggerAnimations() {
        $('.animate__animated').each(function() {
            var $this = $(this);
            // Check if the element has already been animated
            if (!$this.hasClass('animated-done')) { 
                var el = $this[0];
                if (isElementInViewport(el)) {
                    // Get the animation name from the data attribute
                    var animationName = $this.data('animation') || 'fadeIn'; 
                    var delay = $this.data('delay') ? $this.data('delay') : 0;
                    
                    // Set visibility to visible and add animation classes
                    setTimeout(function() {
                         $this.css('visibility', 'visible')
                              .addClass('animate__' + animationName)
                              .addClass('animated-done'); // Mark as done
                    }, parseFloat(delay) * 1000);
                }
            }
        });
    }

    // Initial check for elements already in view (like the Hero section)
    // The Hero section elements have static classes, so we only need to set visibility
    $('#hero .animate__animated, header .animate__animated').css('visibility', 'visible');
    
    // Set initial visibility for all on-scroll elements to hidden (as per CSS)
    $('.animate__animated').not('#hero .animate__animated, header .animate__animated').css('visibility', 'hidden');

    // Run the animation check on scroll and on load
    $(window).on('scroll', triggerAnimations);
    triggerAnimations(); 
});