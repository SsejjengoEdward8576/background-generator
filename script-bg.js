const color1 = document.querySelector(".color1");
const color2 = document.querySelector(".color2");
const gradient = document.getElementById("gradient");
const cssCode = document.getElementById("cssCode");
const randomizeButton = document.getElementById("randomize");
const saveButton = document.getElementById("save");
const loadButton = document.getElementById("load");
const copyCssButton = document.getElementById("copy-css");
const angleInput = document.getElementById("angle-input");
const angleValue = document.getElementById("angle-value");

// Initialize gradient with default angle
let currentAngle = 90;

function angleToDirection(angle) {
    // Convert angle to CSS gradient direction
    return `${angle}deg`;
}

function setGradient() {
    const direction = angleToDirection(currentAngle);
    const gradientValue = `linear-gradient(${direction}, ${color1.value}, ${color2.value})`;
    gradient.style.background = gradientValue;
    cssCode.textContent = `background: ${gradientValue};`;

    // Update background on DOM element
    document.body.style.background = gradientValue;
}

function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Event listeners
color1.addEventListener("input", setGradient);
color2.addEventListener("input", setGradient);

angleInput.addEventListener("input", () => {
    currentAngle = parseInt(angleInput.value);
    angleValue.textContent = currentAngle;
    setGradient();
});

randomizeButton.addEventListener("click", () => {
    color1.value = getRandomColor();
    color2.value = getRandomColor();
    setGradient();
});

copyCssButton.addEventListener("click", () => {
    const cssText = cssCode.textContent;
    
    // Use the Clipboard API if available
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(cssText)
            .then(() => {
                // Provide visual feedback
                const originalText = copyCssButton.textContent;
                copyCssButton.textContent = "Copied!";
                setTimeout(() => {
                    copyCssButton.textContent = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error("Failed to copy text: ", err);
                alert("Failed to copy CSS. Please copy it manually.");
            });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = cssText;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand("copy");
            const originalText = copyCssButton.textContent;
            copyCssButton.textContent = "Copied!";
            setTimeout(() => {
                copyCssButton.textContent = originalText;
            }, 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
            alert("Failed to copy CSS. Please copy it manually.");
        }
        
        document.body.removeChild(textArea);
    }
});

saveButton.addEventListener("click", () => {
    localStorage.setItem("gradientColor1", color1.value);
    localStorage.setItem("gradientColor2", color2.value);
    localStorage.setItem("gradientAngle", currentAngle.toString());
    alert("Gradient saved!");
});

loadButton.addEventListener("click", () => {
    const savedColor1 = localStorage.getItem("gradientColor1");
    const savedColor2 = localStorage.getItem("gradientColor2");
    const savedAngle = localStorage.getItem("gradientAngle");
    
    if (savedColor1 && savedColor2) {
        color1.value = savedColor1;
        color2.value = savedColor2;
        
        if (savedAngle) {
            currentAngle = parseInt(savedAngle);
            angleInput.value = currentAngle;
            angleValue.textContent = currentAngle;
        }
        
        setGradient();
        alert("Gradient loaded!");
    } else {
        alert("No saved gradient found.");
    }
});

// Initial setup
setGradient();
