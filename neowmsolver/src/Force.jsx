import React, { useEffect } from "react";


// Force component
const Force = ({ context, origin, end, magnitude, direction }) => {

    useEffect(() => {
        // If the context is not available, exit early
        if (!context || !origin || !end) return;

    }, [context, origin, end, magnitude, direction]);

    const drawForce = (ctx, origin, end, magnitude, direction) => {
        const [x0, y0] = origin;
        const [x1, y1] = end;

        // Draw the force on the grid
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);

        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw the arrowhead
        const angle = Math.atan2(y1 - y0, x1 - x0);
        const arrowSize = 10;
        ctx.beginPath();
        ctx.moveTo(x1, y1);

        // Draw the first half of the arrowhead
        ctx.lineTo(
            x1 - arrowSize * Math.cos(angle - Math.PI / 6),
            y1 - arrowSize * Math.sin(angle - Math.PI / 6)
        );

        // Draw the second half of the arrowhead
        ctx.moveTo(x1, y1);
        ctx.lineTo(
            x1 - arrowSize * Math.cos(angle + Math.PI / 6),
            y1 - arrowSize * Math.sin(angle + Math.PI / 6)
        );

        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        ctx.stroke();

    }

    return null;
};

export default Force;