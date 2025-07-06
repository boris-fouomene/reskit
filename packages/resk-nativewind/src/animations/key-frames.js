const keyframes = {
    // Fade animations
    "fade-in": {
        "0%": { opacity: 0 },
        "100%": { opacity: 1 },
    },
    "fade-out": {
        "0%": { opacity: 1 },
        "100%": { opacity: 0 },
    },
    /***
              For slide-in, naming (Origin-focused):
              slide-in-left = slides in from left side
              slide-in-right = slides in from right side
              slide-in-up = slides in from top
              slide-in-down = slides in from bottom
              
              For slide-out, the "origin" becomes the destination:
              
              slide-out-left = slides out TO the left side (exits leftward)
              slide-out-right = slides out TO the right side (exits rightward)
              slide-out-up = slides out TO the top (exits upward)
              slide-out-down = slides out TO the bottom (exits downward)
            */
    // Slide animations
    "slide-in-left": {
        "0%": {
            transform: "translateX(-100%)",
            opacity: "0",
        },
        "100%": {
            transform: "translateX(0)",
            opacity: "1",
        },
    },
    "slide-in-right": {
        "0%": {
            transform: "translateX(100%)",
            opacity: "0",
        },
        "100%": {
            transform: "translateX(0)",
            opacity: "1",
        },
    },
    "slide-in-top": {
        "0%": {
            transform: "translateY(-100%)",
            opacity: "0",
        },
        "100%": {
            transform: "translateY(0)",
            opacity: "1",
        },
    },
    "slide-in-bottom": {
        "0%": {
            transform: "translateY(100%)",
            opacity: "0",
        },
        "100%": {
            transform: "translateY(0)",
            opacity: "1",
        },
    },

    // Slide Out Animations
    "slide-out-left": {
        "0%": {
            transform: "translateX(0)",
            opacity: "1",
        },
        "100%": {
            transform: "translateX(-100%)",
            opacity: "0",
        },
    },
    "slide-out-right": {
        "0%": {
            transform: "translateX(0)",
            opacity: "1",
        },
        "100%": {
            transform: "translateX(100%)",
            opacity: "0",
        },
    },
    "slide-out-top": {
        "0%": {
            transform: "translateY(0)",
            opacity: "1",
        },
        "100%": {
            transform: "translateY(-100%)",
            opacity: "0",
        },
    },
    "slide-out-bottom": {
        "0%": {
            transform: "translateY(0)",
            opacity: "1",
        },
        "100%": {
            transform: "translateY(100%)",
            opacity: "0",
        },
    },

    // Scale animations
    "scale-in": {
        "0%": {
            opacity: 0,
            transform: "scale(0.9)",
        },
        "100%": {
            opacity: "1",
            transform: "scale(1)",
        },
    },
    "scale-out": {
        "0%": {
            opacity: "1",
            transform: "scale(1)",
        },
        "100%": {
            opacity: 0,
            transform: "scale(0.9)",
        },
    },

    // Zoom animations
    "zoom-in": {
        "0%": {
            opacity: 0,
            transform: "scale(0.5)",
        },
        "100%": {
            opacity: "1",
            transform: "scale(1)",
        },
    },
    "zoom-out": {
        "0%": {
            opacity: "1",
            transform: "scale(1)",
        },
        "100%": {
            opacity: 0,
            transform: "scale(0.5)",
        },
    },
    rotate: {
        "0%": { transform: "rotate(0deg)" },
        "100%": { transform: "rotate(360deg)" },
    },
    "rotate-reverse": {
        "0%": { transform: "rotate(0deg)" },
        "100%": { transform: "rotate(-360deg)" },
    },
    // Flip animations
    "flip-horizontal": {
        "0%": { transform: "rotateY(0)" },
        "100%": { transform: "rotateY(180deg)" },
    },
    "flip-vertical": {
        "0%": { transform: "rotateX(0)" },
        "100%": { transform: "rotateX(180deg)" },
    },
};


module.exports = keyframes;