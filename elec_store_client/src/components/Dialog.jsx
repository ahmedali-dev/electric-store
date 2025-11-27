import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import Button from "./Button";
import Spinner from "./Spinner";

const container = document.getElementById("dialog");

const Dialog = ({ open, close, action, isSubmitting, type, children, loading = false }) => {
	const [isVisible, setIsVisible] = useState(false);

	// Control internal visibility (for exit animation)
	useEffect(() => {
		if (open) {
			setIsVisible(true);
		} else {
			// delay unmount
			const timeout = setTimeout(() => setIsVisible(false), 200);
			return () => clearTimeout(timeout);
		}
	}, [open]);

	if (!isVisible) return null;

	return createPortal(
		<>
			{/* Animated Mask */}
			<motion.div
				onClick={close}
				className="fixed z-20 top-0 left-0 inset-0 bg-black/80"
				initial={{ opacity: 0 }}
				animate={{
					opacity: open ? 1 : 0,
				}}
				transition={{ duration: 0.2 }}
			/>

			{/* Animated Dialog */}
			<motion.dialog
				open={open}
				className="fixed z-30 top-[50%] left-[50%] -translate-y-1/2 -translate-x-1/2 bg-gray shadow-md p-3 rounded min-w-[350px]"
				style={{ transform: "translate(-50%, -50%)" }}
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{
					opacity: open ? 1 : 0,
					scale: open ? 1 : 0.9,
				}}
				transition={{ duration: 0.25 }}
			>
				{loading ? (
					<div className="flex justify-center items-center min-h-[150px]">
						<Spinner fullAndCenter={true} size={40} />
					</div>
				) : (
					<>
						{" "}
						<div className="mb-[1rem] flex flex-col items-center justify-center min-height-[100px] text-center">
							{children}
						</div>
						<div className="flex gap-3 justify-around">
							<button
								onClick={close}
								className="p-2 cursor-pointer border border-secondary rounded min-w-[100px] text-center"
							>
								Cancel
							</button>

							<Button onClick={action} type={type} loading={isSubmitting} className="min-w-[100px]">
								OK
							</Button>
						</div>
					</>
				)}
			</motion.dialog>
		</>,
		container
	);
};

export default Dialog;
