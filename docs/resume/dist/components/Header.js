"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderHeader = renderHeader;
function renderHeader({ personalInfo, includeLinks = true, format = 'standard' }) {
    const { name, email, phone, address, website } = personalInfo;
    let markdown = `# ${name}\n\n`;
    if (format === 'latex') {
        markdown += `${email}\n\n`;
        markdown += `${phone}\n\n`;
        markdown += `${address}\n\n`;
        if (includeLinks) {
            markdown += `${website}\n\n`;
        }
    }
    else {
        markdown += `📧 ${email}\n\n`;
        markdown += `📱 ${phone}\n\n`;
        markdown += `📍 ${address}\n\n`;
        if (includeLinks) {
            markdown += `🌐 ${website}\n\n`;
        }
    }
    return markdown;
}
//# sourceMappingURL=Header.js.map