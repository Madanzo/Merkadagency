import jsPDF from 'jspdf';
import type { QuoteSummary, ProjectInfo } from './calculator.types';

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

const generateQuoteNumber = (): string => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `MKD-${year}${month}${day}-${random}`;
};

export async function generateScopePDF(
    quote: QuoteSummary,
    projectInfo: ProjectInfo
): Promise<void> {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    const footerHeight = 25; // Reserved space for footer
    const maxContentY = pageHeight - footerHeight;
    let yPos = margin;

    const quoteNumber = generateQuoteNumber();
    const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const validUntil = projectInfo.quoteValidUntil
        ? new Date(projectInfo.quoteValidUntil)
        : (() => { const d = new Date(); d.setDate(d.getDate() + 14); return d; })();
    const validUntilStr = validUntil.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    // Helper function to check if we need a new page
    const checkPageBreak = (neededSpace: number) => {
        if (yPos + neededSpace > maxContentY) {
            addFooter();
            doc.addPage();
            yPos = margin;
        }
    };

    // Helper function to add footer
    const addFooter = () => {
        const footerY = pageHeight - 12;
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text('MerkadAgency | www.merkadagency.com', pageWidth / 2, footerY, { align: 'center' });
    };

    // Header
    doc.setFillColor(124, 58, 237); // #7C3AED
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('MerkadAgency', margin, 26);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Quote #${quoteNumber}`, pageWidth - margin, 20, { align: 'right' });
    doc.text(today, pageWidth - margin, 28, { align: 'right' });

    yPos = 55;

    // Project Info Section
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PROJECT DETAILS', margin, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const projectDetails: [string, string][] = [
        ['Project Name:', projectInfo.name || 'TBD'],
        ['Industry:', projectInfo.industry || 'TBD'],
        ['Timeline:', projectInfo.timeline || 'TBD'],
    ];

    // Add contact info if provided
    if (projectInfo.contactName) {
        projectDetails.push(['Contact:', projectInfo.contactName]);
    }
    if (projectInfo.contactEmail) {
        projectDetails.push(['Email:', projectInfo.contactEmail]);
    }
    if (projectInfo.contactPhone) {
        projectDetails.push(['Phone:', projectInfo.contactPhone]);
    }
    if (projectInfo.businessWebsite) {
        projectDetails.push(['Website:', projectInfo.businessWebsite]);
    }

    projectDetails.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.text(label, margin, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(value, margin + 35, yPos);
        yPos += 6;
    });

    if (projectInfo.notes) {
        doc.setFont('helvetica', 'bold');
        doc.text('Notes:', margin, yPos);
        yPos += 6;
        doc.setFont('helvetica', 'normal');
        const noteLines = doc.splitTextToSize(projectInfo.notes, contentWidth);
        doc.text(noteLines, margin, yPos);
        yPos += noteLines.length * 5;
    }

    yPos += 10;

    // Divider
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 15;

    // Scope Breakdown
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('SCOPE BREAKDOWN', margin, yPos);
    yPos += 12;

    // Base Package
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(margin, yPos - 4, contentWidth, 18, 2, 2, 'F');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 80, 80);
    doc.text(`Base Package: ${quote.basePackage.label}`, margin + 4, yPos + 4);
    doc.text(formatCurrency(quote.basePackage.price), pageWidth - margin - 4, yPos + 4, { align: 'right' });

    // Base package description
    if (quote.basePackage.description) {
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(120, 120, 120);
        doc.text(quote.basePackage.description, margin + 4, yPos + 12);
    }
    yPos += 22;

    // Add-ons
    if (quote.addons.length > 0) {
        checkPageBreak(20 + quote.addons.length * 12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 100, 100);
        doc.text('Add-ons:', margin, yPos);
        yPos += 8;

        quote.addons.forEach((addon) => {
            checkPageBreak(12);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(80, 80, 80);
            doc.text(`• ${addon.label}`, margin + 4, yPos);
            doc.text(formatCurrency(addon.price), pageWidth - margin - 4, yPos, { align: 'right' });

            // Show description if available
            if (addon.description) {
                yPos += 4;
                doc.setFontSize(8);
                doc.setTextColor(120, 120, 120);
                doc.text(`  ${addon.description}`, margin + 8, yPos);
            }
            yPos += 6;
        });
        yPos += 4;
    }

    // Show discount if present
    if (quote.discount && quote.discount.amount > 0) {
        checkPageBreak(20);

        // Subtotal line
        doc.setFillColor(250, 250, 250);
        doc.roundedRect(margin, yPos - 4, contentWidth, 10, 2, 2, 'F');
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text('Subtotal:', margin + 4, yPos + 3);
        doc.text(formatCurrency(quote.oneTimeTotal), pageWidth - margin - 4, yPos + 3, { align: 'right' });
        yPos += 12;

        // Discount line
        doc.setTextColor(217, 119, 6); // Amber color
        doc.setFont('helvetica', 'bold');
        const discountLabel = quote.discount.type === 'percentage'
            ? `Discount (${quote.discount.value}%):`
            : 'Discount:';
        doc.text(discountLabel, margin + 4, yPos);
        doc.text(`-${formatCurrency(quote.discount.amount)}`, pageWidth - margin - 4, yPos, { align: 'right' });
        yPos += 10;
    }

    // One-time Total
    checkPageBreak(20);
    doc.setFillColor(124, 58, 237);
    doc.roundedRect(margin, yPos, contentWidth, 14, 2, 2, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('ONE-TIME TOTAL', margin + 4, yPos + 9);
    doc.text(formatCurrency(quote.finalOneTimeTotal), pageWidth - margin - 4, yPos + 9, { align: 'right' });
    yPos += 24;

    // Monthly Recurring
    if (quote.monthly.length > 0) {
        checkPageBreak(30 + quote.monthly.length * 12);
        doc.setTextColor(60, 60, 60);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('MONTHLY RECURRING SERVICES', margin, yPos);
        yPos += 12;

        quote.monthly.forEach((item) => {
            checkPageBreak(12);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(80, 80, 80);
            doc.text(`• ${item.label}`, margin + 4, yPos);
            doc.text(`${formatCurrency(item.price)}/mo`, pageWidth - margin - 4, yPos, { align: 'right' });

            // Show description if available
            if (item.description) {
                yPos += 4;
                doc.setFontSize(8);
                doc.setTextColor(120, 120, 120);
                doc.text(`  ${item.description}`, margin + 8, yPos);
            }
            yPos += 6;
        });
        yPos += 4;

        // Monthly Subtotal
        checkPageBreak(20);
        doc.setFillColor(245, 245, 245);
        doc.roundedRect(margin, yPos, contentWidth, 12, 2, 2, 'F');
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text('Services Subtotal:', margin + 4, yPos + 8);
        doc.text(`${formatCurrency(quote.monthlyTotal)}/mo`, pageWidth - margin - 4, yPos + 8, { align: 'right' });
        yPos += 14;

        // Monthly Discount (if any)
        if (quote.monthlyDiscount && quote.monthlyDiscount.amount > 0) {
            doc.setTextColor(34, 197, 94); // Green
            doc.setFont('helvetica', 'bold');
            const monthlyDiscountLabel = quote.monthlyDiscount.type === 'percentage'
                ? `Monthly Discount (${quote.monthlyDiscount.value}%):`
                : 'Monthly Discount:';
            doc.text(monthlyDiscountLabel, margin + 4, yPos);
            doc.text(`-${formatCurrency(quote.monthlyDiscount.amount)}/mo`, pageWidth - margin - 4, yPos, { align: 'right' });
            yPos += 10;
        }

        // Services Total (after discount)
        doc.setFillColor(34, 197, 94); // Green
        doc.roundedRect(margin, yPos, contentWidth, 14, 2, 2, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('SERVICES TOTAL', margin + 4, yPos + 9);
        doc.text(`${formatCurrency(quote.finalMonthlyTotal)}/mo`, pageWidth - margin - 4, yPos + 9, { align: 'right' });
        yPos += 18;

        // Ad Spend (if any)
        if (quote.adSpend > 0) {
            checkPageBreak(30);
            doc.setFillColor(59, 130, 246); // Blue
            doc.roundedRect(margin, yPos, contentWidth, 14, 2, 2, 'F');

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text('AD SPEND (Media Budget)', margin + 4, yPos + 9);
            doc.text(`${formatCurrency(quote.adSpend)}/mo`, pageWidth - margin - 4, yPos + 9, { align: 'right' });
            yPos += 18;

            // Grand Monthly Total
            doc.setFillColor(16, 185, 129); // Emerald
            doc.roundedRect(margin, yPos, contentWidth, 16, 2, 2, 'F');

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('GRAND MONTHLY TOTAL', margin + 4, yPos + 10);
            doc.text(`${formatCurrency(quote.grandMonthlyTotal)}/mo`, pageWidth - margin - 4, yPos + 10, { align: 'right' });
            yPos += 24;
        } else {
            yPos += 6;
        }
    }

    // Terms Section
    checkPageBreak(60); // Reserve space for terms
    yPos += 5;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 15;

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('TERMS & CONDITIONS', margin, yPos);
    yPos += 10;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);

    // Build payment terms string from user selection
    let paymentTermsStr = '50% deposit to commence work, 50% upon completion'; // default
    switch (projectInfo.paymentTerms) {
        case '50-50':
            paymentTermsStr = '50% deposit to commence work, 50% upon completion';
            break;
        case '100-upfront':
            paymentTermsStr = '100% payment upfront before work commences';
            break;
        case '30-60-10':
            paymentTermsStr = '30% deposit to commence work, 60% at midpoint delivery, 10% upon final completion';
            break;
        case 'net-30':
            paymentTermsStr = 'Net 30 — full payment due within 30 days of invoice';
            break;
        case 'custom':
            paymentTermsStr = 'Custom payment terms as agreed upon';
            break;
    }

    const terms = [
        `• Payment Terms: ${paymentTermsStr}`,
        '• Monthly services billed on the 1st of each month',
        `• This quote is valid for 14 days (until ${validUntilStr})`,
        '• Timeline begins after deposit and scope approval',
        '• Additional requests outside of scope may incur additional fees',
    ];

    terms.forEach((term) => {
        doc.text(term, margin, yPos);
        yPos += 6;
    });

    // Add footer to last page
    addFooter();

    // Save the PDF
    const fileName = projectInfo.name
        ? `MerkadAgency-Scope-${projectInfo.name.replace(/\s+/g, '-')}.pdf`
        : `MerkadAgency-Scope-${quoteNumber}.pdf`;

    doc.save(fileName);
}

export function generateClipboardText(
    quote: QuoteSummary,
    projectInfo: ProjectInfo
): string {
    const lines: string[] = [];

    lines.push('═══════════════════════════════════════');
    lines.push('        MERKADAGENCY QUOTE');
    lines.push('═══════════════════════════════════════');
    lines.push('');

    if (projectInfo.name) {
        lines.push(`Project: ${projectInfo.name}`);
    }
    if (projectInfo.industry) {
        lines.push(`Industry: ${projectInfo.industry}`);
    }
    if (projectInfo.timeline) {
        lines.push(`Timeline: ${projectInfo.timeline}`);
    }
    if (projectInfo.contactName) {
        lines.push(`Contact: ${projectInfo.contactName}`);
    }
    if (projectInfo.contactEmail) {
        lines.push(`Email: ${projectInfo.contactEmail}`);
    }
    if (projectInfo.contactPhone) {
        lines.push(`Phone: ${projectInfo.contactPhone}`);
    }
    lines.push('');

    lines.push('───────────────────────────────────────');
    lines.push('ONE-TIME INVESTMENT');
    lines.push('───────────────────────────────────────');
    lines.push(`Base: ${quote.basePackage.label.padEnd(25)} ${formatCurrency(quote.basePackage.price)}`);

    if (quote.addons.length > 0) {
        lines.push('');
        lines.push('Add-ons:');
        quote.addons.forEach((addon) => {
            lines.push(`  • ${addon.label.padEnd(30)} ${formatCurrency(addon.price)}`);
        });
    }

    lines.push('');
    if (quote.discount && quote.discount.amount > 0) {
        lines.push(`Subtotal:                       ${formatCurrency(quote.oneTimeTotal)}`);
        const discountLabel = quote.discount.type === 'percentage'
            ? `Discount (${quote.discount.value}%):`
            : 'Discount:';
        lines.push(`${discountLabel.padEnd(32)} -${formatCurrency(quote.discount.amount)}`);
    }
    lines.push(`ONE-TIME TOTAL:                 ${formatCurrency(quote.finalOneTimeTotal)}`);

    if (quote.monthly.length > 0) {
        lines.push('');
        lines.push('───────────────────────────────────────');
        lines.push('MONTHLY RECURRING');
        lines.push('───────────────────────────────────────');
        quote.monthly.forEach((item) => {
            lines.push(`  • ${item.label.padEnd(30)} ${formatCurrency(item.price)}/mo`);
        });
        lines.push('');
        if (quote.monthlyDiscount && quote.monthlyDiscount.amount > 0) {
            lines.push(`Subtotal:                       ${formatCurrency(quote.monthlyTotal)}/mo`);
            const mdLabel = quote.monthlyDiscount.type === 'percentage'
                ? `Monthly Discount (${quote.monthlyDiscount.value}%):`
                : 'Monthly Discount:';
            lines.push(`${mdLabel.padEnd(32)} -${formatCurrency(quote.monthlyDiscount.amount)}/mo`);
        }
        lines.push(`MONTHLY TOTAL:                  ${formatCurrency(quote.finalMonthlyTotal)}/mo`);

        if (quote.adSpend > 0) {
            lines.push(`AD SPEND:                       ${formatCurrency(quote.adSpend)}/mo`);
            lines.push(`GRAND MONTHLY TOTAL:            ${formatCurrency(quote.grandMonthlyTotal)}/mo`);
        }
    }

    // Dynamic payment terms
    let termsStr = '50% to start | 50% on delivery';
    switch (projectInfo.paymentTerms) {
        case '50-50': termsStr = '50% to start | 50% on delivery'; break;
        case '100-upfront': termsStr = '100% upfront'; break;
        case '30-60-10': termsStr = '30% deposit | 60% midpoint | 10% completion'; break;
        case 'net-30': termsStr = 'Net 30'; break;
        case 'custom': termsStr = 'Custom terms as agreed'; break;
    }

    lines.push('');
    lines.push('═══════════════════════════════════════');
    lines.push(`Terms: ${termsStr}`);
    lines.push('Quote valid for 14 days');
    lines.push('═══════════════════════════════════════');

    return lines.join('\n');
}
