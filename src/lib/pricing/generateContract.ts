import jsPDF from 'jspdf';
import type { Contract } from '../contracts';
import type { ClientProfile } from '../clients';

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

export async function generateContractPDF(
    contract: Contract,
    client: ClientProfile
): Promise<void> {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    const footerHeight = 25;
    const maxContentY = pageHeight - footerHeight;
    let yPos = margin;

    const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    // Helper: page break
    const checkPageBreak = (neededSpace: number) => {
        if (yPos + neededSpace > maxContentY) {
            addFooter();
            doc.addPage();
            yPos = margin;
        }
    };

    // Helper: footer
    const addFooter = () => {
        const footerY = pageHeight - 12;
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text('MerkadAgency | www.merkadagency.com', pageWidth / 2, footerY, { align: 'center' });
    };

    // ═══════════════════════════════════════════
    // HEADER
    // ═══════════════════════════════════════════
    doc.setFillColor(124, 58, 237); // Purple
    doc.rect(0, 0, pageWidth, 45, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.text('SERVICE AGREEMENT', margin, 22);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('MerkadAgency', margin, 32);

    doc.setFontSize(10);
    doc.text(`Contract #${contract.contractNumber}`, pageWidth - margin, 20, { align: 'right' });
    doc.text(today, pageWidth - margin, 28, { align: 'right' });

    yPos = 60;

    // ═══════════════════════════════════════════
    // PARTIES
    // ═══════════════════════════════════════════
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('PARTIES', margin, yPos);
    yPos += 10;

    doc.setFontSize(9);

    // Provider (left column)
    doc.setFont('helvetica', 'bold');
    doc.text('Provider:', margin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text('MerkadAgency', margin + 25, yPos);
    yPos += 5;
    doc.text('www.merkadagency.com', margin + 25, yPos);
    yPos += 8;

    // Client (left column)
    doc.setFont('helvetica', 'bold');
    doc.text('Client:', margin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(client.name || 'TBD', margin + 25, yPos);
    yPos += 5;
    if (client.business) {
        doc.text(client.business, margin + 25, yPos);
        yPos += 5;
    }
    if (client.email) {
        doc.text(client.email, margin + 25, yPos);
        yPos += 5;
    }
    if (client.phone) {
        doc.text(client.phone, margin + 25, yPos);
        yPos += 5;
    }

    yPos += 8;

    // Divider
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 12;

    // ═══════════════════════════════════════════
    // SCOPE OF WORK
    // ═══════════════════════════════════════════
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(60, 60, 60);
    doc.text('SCOPE OF WORK', margin, yPos);
    yPos += 10;

    // One-time services
    if (contract.services.length > 0) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 100, 100);
        doc.text('One-Time Services:', margin, yPos);
        yPos += 8;

        contract.services.forEach((service) => {
            checkPageBreak(14);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(80, 80, 80);
            doc.text(`• ${service.label}`, margin + 4, yPos);
            doc.text(formatCurrency(service.price), pageWidth - margin - 4, yPos, { align: 'right' });

            if (service.description) {
                yPos += 4;
                doc.setFontSize(8);
                doc.setTextColor(120, 120, 120);
                doc.text(`  ${service.description}`, margin + 8, yPos);
            }
            yPos += 6;
        });
        yPos += 4;
    }

    // Monthly services
    if (contract.monthlyServices.length > 0) {
        checkPageBreak(20 + contract.monthlyServices.length * 12);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 100, 100);
        doc.text('Monthly Recurring Services:', margin, yPos);
        yPos += 8;

        contract.monthlyServices.forEach((service) => {
            checkPageBreak(14);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(80, 80, 80);
            doc.text(`• ${service.label}`, margin + 4, yPos);
            doc.text(`${formatCurrency(service.price)}/mo`, pageWidth - margin - 4, yPos, { align: 'right' });

            if (service.description) {
                yPos += 4;
                doc.setFontSize(8);
                doc.setTextColor(120, 120, 120);
                doc.text(`  ${service.description}`, margin + 8, yPos);
            }
            yPos += 6;
        });
        yPos += 4;
    }

    // ═══════════════════════════════════════════
    // TOTALS
    // ═══════════════════════════════════════════
    checkPageBreak(40);
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;

    // One-time total
    doc.setFillColor(124, 58, 237);
    doc.roundedRect(margin, yPos, contentWidth, 14, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('ONE-TIME INVESTMENT', margin + 4, yPos + 9);
    doc.text(formatCurrency(contract.finalOneTimeTotal), pageWidth - margin - 4, yPos + 9, { align: 'right' });
    yPos += 20;

    // Monthly total
    if (contract.finalMonthlyTotal > 0) {
        doc.setFillColor(34, 197, 94);
        doc.roundedRect(margin, yPos, contentWidth, 14, 2, 2, 'F');
        doc.setTextColor(255, 255, 255);
        doc.text('MONTHLY RECURRING', margin + 4, yPos + 9);
        doc.text(`${formatCurrency(contract.finalMonthlyTotal)}/mo`, pageWidth - margin - 4, yPos + 9, { align: 'right' });
        yPos += 20;
    }

    // ═══════════════════════════════════════════
    // TERMS & CONDITIONS
    // ═══════════════════════════════════════════
    checkPageBreak(80);
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('TERMS & CONDITIONS', margin, yPos);
    yPos += 10;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);

    const terms = [
        `1. Payment Terms: ${contract.paymentTerms}`,
        '2. Monthly services are billed on the 1st of each month.',
        '3. Timeline begins after deposit payment and written scope approval.',
        '4. Additional requests outside the defined scope may incur additional fees.',
        '5. Either party may terminate monthly services with 30 days written notice.',
        '6. Client retains ownership of all custom-developed designs, code, and content upon full payment.',
        '7. MerkadAgency retains the right to showcase the project in its portfolio unless otherwise agreed.',
        '8. This agreement is governed by the laws of the State of Texas.',
    ];

    terms.forEach((term) => {
        checkPageBreak(8);
        const lines = doc.splitTextToSize(term, contentWidth);
        doc.text(lines, margin, yPos);
        yPos += lines.length * 4 + 2;
    });

    // ═══════════════════════════════════════════
    // SIGNATURE SECTION
    // ═══════════════════════════════════════════
    checkPageBreak(60);
    yPos += 10;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 15;

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('SIGNATURES', margin, yPos);
    yPos += 15;

    const colWidth = (contentWidth - 20) / 2;

    // Provider signature
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('MerkadAgency', margin, yPos);
    yPos += 15;
    doc.setDrawColor(150, 150, 150);
    doc.line(margin, yPos, margin + colWidth, yPos);
    yPos += 5;
    doc.setFontSize(8);
    doc.text('Signature', margin, yPos);
    doc.text('Date', margin + colWidth - 30, yPos);
    yPos += 15;

    // Client signature
    doc.setFontSize(9);
    doc.text(client.name || 'Client', margin, yPos);
    if (client.business) {
        doc.text(client.business, margin + 50, yPos);
    }
    yPos += 15;
    doc.line(margin, yPos, margin + colWidth, yPos);
    yPos += 5;
    doc.setFontSize(8);
    doc.text('Signature', margin, yPos);
    doc.text('Date', margin + colWidth - 30, yPos);

    // Footer on last page
    addFooter();

    // Save
    const fileName = client.business
        ? `MerkadAgency-Contract-${client.business.replace(/\s+/g, '-')}.pdf`
        : `MerkadAgency-Contract-${contract.contractNumber}.pdf`;

    doc.save(fileName);
}
