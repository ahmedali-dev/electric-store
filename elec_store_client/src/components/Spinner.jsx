import React from "react";

const Spinner = ({ size = 40, color = "#4A90E2", speed = 0.8, className = "", fullAndCenter = false }) => {
	// Helper to handle numeric (40) vs string ("40px") sizes
	const sizeValue = typeof size === "number" ? `${size}px` : size;

	// Calculate border thickness relative to size (approx 1/7th) for good aesthetics
	// or default to 4px if size is complex string
	const borderThickness = typeof size === "number" ? `${size / 7}px` : "4px";

	const styles = {
		container: {
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			width: sizeValue,
			height: sizeValue,
			minWidth: sizeValue, // Prevents shrinking in flex containers
			minHeight: sizeValue,
			borderRadius: "50%",
			border: `${borderThickness} solid transparent`, // Invisible base
			borderTopColor: color, // The visible "Moon"
			borderRightColor: color, // optional: add this for a 50% moon, remove for 25%
			boxSizing: "border-box",
			animation: `moonLoaderSpin ${speed}s linear infinite`,
		},
	};

	return (
		<>
			<style>
				{`
          @keyframes moonLoaderSpin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
			</style>
			<div
				className={fullAndCenter ? "absolute top-0 left-0 w-full h-full flex items-center justify-center" : ""}
			>
				<div style={styles.container} className={className} role="status" aria-label="Loading"></div>
			</div>
		</>
	);
};

export default Spinner;
