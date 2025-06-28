For progressbar indeterminate support, Add the following css code in your .css file

```css
.progress-bar-indeterminate {
    animation: progressbarindeterminate 1s infinite linear;
    transform-origin: 0% 50%;
    width: 100%;
    height: 100%;
}

@keyframes progressbarindeterminate {
    0% {
        transform: translateX(0) scaleX(0);
    }
    40% {
        transform: translateX(0) scaleX(0.4);
    }
    100% {
        transform: translateX(100%) scaleX(0.5);
    }
}
```
