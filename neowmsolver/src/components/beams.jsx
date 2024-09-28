const CreateBeams = (startPoint, endPoint){
    const large = endPoint - startPoint
    const angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
    const angleInDegrees = (angle * (180 / Math.PI) + 360) % 360;
}