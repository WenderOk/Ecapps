import { QRCodeSVG } from "qrcode.react";

interface QRCodeGeneratorProps {
    value: string;
    size?: number;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ value, size = 180 }) => {
    return (
        <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
            <QRCodeSVG
                value={value}
                size={size}
                bgColor="#ffffff"
                fgColor="#000000"
                level="M"
                includeMargin={true}
            />
        </div>
    );
};

export default QRCodeGenerator;
