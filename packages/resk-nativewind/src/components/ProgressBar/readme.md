For progressbar indeterminate support on native, Add the following css code in your .css file

```css
.progress-bar-indeterminate {
    animation: progressbarindeterminate 1s infinite linear;
}

/* RTL (Right-to-Left) Animation */
.progress-bar-indeterminate-rtl {
    animation: progressbarindeterminate-rtl 1s infinite linear;
}

/* LTR (Left-to-Right) Animation */
@keyframes progressbarindeterminate {
    0% {
        transform: translateX(-50%) scaleX(0.0001);
    }

    50% {
        transform: translateX(50%) scaleX(0.4);
    }

    100% {
        transform: translateX(100%) scaleX(0.0001);
    }
}


@keyframes progressbarindeterminate-rtl {
    0% {
        transform: translateX(50%) scaleX(0.0001);
    }

    50% {
        transform: translateX(-50%) scaleX(0.4);
    }

    100% {
        transform: translateX(-100%) scaleX(0.0001);
    }
}
```
