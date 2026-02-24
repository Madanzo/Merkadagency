import type { Contract } from '../contracts';
import type { ClientProfile } from '../clients';

const formatCurrency = (amount: number): string =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);

/**
 * Generate styled HTML for contract preview.
 * Uses a dark theme for screen and includes a print-friendly white version.
 */
export function generateContractHTML(
    contract: Contract,
    client: ClientProfile
): string {
    const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
    });

    // Build service rows
    const serviceRows = contract.services.map((s, i) => `
        <tr>
            <td style="padding: 10px 12px; border-bottom: 1px solid #2a2d3a; color: #e0e0e0;">${i + 1}</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #2a2d3a;">
                <div style="color: #ffffff; font-weight: 500;">${s.label}</div>
                ${s.description ? `<div style="color: #888; font-size: 12px; margin-top: 2px;">${s.description}</div>` : ''}
            </td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #2a2d3a; text-align: right; color: #e0e0e0; white-space: nowrap;">${formatCurrency(s.price)}</td>
        </tr>
    `).join('');

    const monthlyRows = contract.monthlyServices.map((s, i) => `
        <tr>
            <td style="padding: 10px 12px; border-bottom: 1px solid #2a2d3a; color: #e0e0e0;">${i + 1}</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #2a2d3a;">
                <div style="color: #ffffff; font-weight: 500;">${s.label}</div>
                ${s.description ? `<div style="color: #888; font-size: 12px; margin-top: 2px;">${s.description}</div>` : ''}
            </td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #2a2d3a; text-align: right; color: #e0e0e0; white-space: nowrap;">${formatCurrency(s.price)}/mo</td>
        </tr>
    `).join('');

    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
    @media print {
        body { background: #fff !important; color: #222 !important; }
        .contract-body { background: #fff !important; color: #222 !important; border: none !important; }
        .contract-header { background: #5A27FF !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        td, th, .section-title, .info-label, .info-value { color: #222 !important; }
        tr { border-color: #ddd !important; }
        td { border-bottom-color: #ddd !important; }
        .total-bar { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .sig-line { border-color: #999 !important; }
    }
</style>
</head>
<body style="margin: 0; padding: 24px; background: #0F1220; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
<div class="contract-body" style="max-width: 800px; margin: 0 auto; background: #181b2e; border-radius: 12px; overflow: hidden; border: 1px solid #2a2d3a;">

    <!-- HEADER -->
    <div class="contract-header" style="background: linear-gradient(135deg, #5A27FF 0%, #7c3aed 100%); padding: 32px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
                <h1 style="margin: 0 0 4px 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">SERVICE AGREEMENT</h1>
                <p style="margin: 0; opacity: 0.85; font-size: 14px;">MerkadAgency</p>
            </div>
            <div style="text-align: right;">
                <p style="margin: 0; font-size: 13px; opacity: 0.85;">Contract #${contract.contractNumber}</p>
                <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.85;">${today}</p>
            </div>
        </div>
    </div>

    <!-- PARTIES -->
    <div style="padding: 24px 32px;">
        <div class="section-title" style="font-size: 13px; font-weight: 600; color: #5A27FF; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px;">Parties</div>
        <div style="display: flex; gap: 40px;">
            <div style="flex: 1;">
                <div class="info-label" style="font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">Provider</div>
                <div class="info-value" style="color: #fff; font-weight: 600; margin-top: 4px;">MerkadAgency</div>
                <div class="info-value" style="color: #aaa; font-size: 13px;">www.merkadagency.com</div>
            </div>
            <div style="flex: 1;">
                <div class="info-label" style="font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">Client</div>
                <div class="info-value" style="color: #fff; font-weight: 600; margin-top: 4px;">${client.name}</div>
                ${client.business ? `<div class="info-value" style="color: #aaa; font-size: 13px;">${client.business}</div>` : ''}
                ${client.email ? `<div class="info-value" style="color: #aaa; font-size: 13px;">${client.email}</div>` : ''}
                ${client.phone ? `<div class="info-value" style="color: #aaa; font-size: 13px;">${client.phone}</div>` : ''}
            </div>
        </div>
    </div>

    <div style="border-top: 1px solid #2a2d3a; margin: 0 32px;"></div>

    <!-- ONE-TIME SERVICES -->
    ${contract.services.length > 0 ? `
    <div style="padding: 24px 32px;">
        <div class="section-title" style="font-size: 13px; font-weight: 600; color: #5A27FF; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">One-Time Services</div>
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr>
                    <th style="padding: 8px 12px; text-align: left; font-size: 11px; color: #888; text-transform: uppercase; border-bottom: 1px solid #2a2d3a; width: 40px;">#</th>
                    <th style="padding: 8px 12px; text-align: left; font-size: 11px; color: #888; text-transform: uppercase; border-bottom: 1px solid #2a2d3a;">Service</th>
                    <th style="padding: 8px 12px; text-align: right; font-size: 11px; color: #888; text-transform: uppercase; border-bottom: 1px solid #2a2d3a;">Price</th>
                </tr>
            </thead>
            <tbody>${serviceRows}</tbody>
        </table>
        <div class="total-bar" style="margin-top: 12px; padding: 12px 16px; background: #5A27FF; border-radius: 8px; display: flex; justify-content: space-between; color: #fff; font-weight: 600;">
            <span>ONE-TIME TOTAL</span>
            <span>${formatCurrency(contract.finalOneTimeTotal)}</span>
        </div>
    </div>
    ` : ''}

    <!-- MONTHLY SERVICES -->
    ${contract.monthlyServices.length > 0 ? `
    <div style="padding: 0 32px 24px;">
        <div class="section-title" style="font-size: 13px; font-weight: 600; color: #22c55e; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">Monthly Recurring</div>
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr>
                    <th style="padding: 8px 12px; text-align: left; font-size: 11px; color: #888; text-transform: uppercase; border-bottom: 1px solid #2a2d3a; width: 40px;">#</th>
                    <th style="padding: 8px 12px; text-align: left; font-size: 11px; color: #888; text-transform: uppercase; border-bottom: 1px solid #2a2d3a;">Service</th>
                    <th style="padding: 8px 12px; text-align: right; font-size: 11px; color: #888; text-transform: uppercase; border-bottom: 1px solid #2a2d3a;">Monthly</th>
                </tr>
            </thead>
            <tbody>${monthlyRows}</tbody>
        </table>
        <div class="total-bar" style="margin-top: 12px; padding: 12px 16px; background: #22c55e; border-radius: 8px; display: flex; justify-content: space-between; color: #fff; font-weight: 600;">
            <span>MONTHLY TOTAL</span>
            <span>${formatCurrency(contract.finalMonthlyTotal)}/mo</span>
        </div>
    </div>
    ` : ''}

    <div style="border-top: 1px solid #2a2d3a; margin: 0 32px;"></div>

    <!-- TERMS -->
    <div style="padding: 24px 32px;">
        <div class="section-title" style="font-size: 13px; font-weight: 600; color: #5A27FF; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">Terms & Conditions</div>
        <div style="color: #aaa; font-size: 13px; line-height: 1.8;">
            <p style="margin: 0 0 6px;">1. <strong style="color: #e0e0e0;">Payment Terms:</strong> ${contract.paymentTerms}</p>
            <p style="margin: 0 0 6px;">2. Monthly services are billed on the 1st of each month.</p>
            <p style="margin: 0 0 6px;">3. Timeline begins after deposit payment and written scope approval.</p>
            <p style="margin: 0 0 6px;">4. Additional requests outside the defined scope may incur additional fees.</p>
            <p style="margin: 0 0 6px;">5. Either party may terminate monthly services with 30 days written notice.</p>
            <p style="margin: 0 0 6px;">6. Client retains ownership of all custom-developed work upon full payment.</p>
            <p style="margin: 0 0 6px;">7. MerkadAgency retains the right to showcase the project in its portfolio unless otherwise agreed.</p>
            <p style="margin: 0;">8. This agreement is governed by the laws of the State of Texas.</p>
        </div>
    </div>

    <div style="border-top: 1px solid #2a2d3a; margin: 0 32px;"></div>

    <!-- SIGNATURES -->
    <div style="padding: 32px;">
        <div class="section-title" style="font-size: 13px; font-weight: 600; color: #5A27FF; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 24px;">Signatures</div>
        <div style="display: flex; gap: 48px;">
            <div style="flex: 1;">
                <p style="color: #aaa; font-size: 13px; margin: 0 0 40px;">MerkadAgency</p>
                <div class="sig-line" style="border-top: 1px solid #555; padding-top: 8px; display: flex; justify-content: space-between;">
                    <span style="color: #888; font-size: 12px;">Signature</span>
                    <span style="color: #888; font-size: 12px;">Date</span>
                </div>
            </div>
            <div style="flex: 1;">
                <p style="color: #aaa; font-size: 13px; margin: 0 0 40px;">${client.name}${client.business ? ` — ${client.business}` : ''}</p>
                <div class="sig-line" style="border-top: 1px solid #555; padding-top: 8px; display: flex; justify-content: space-between;">
                    <span style="color: #888; font-size: 12px;">Signature</span>
                    <span style="color: #888; font-size: 12px;">Date</span>
                </div>
            </div>
        </div>
    </div>

    <!-- FOOTER -->
    <div style="padding: 16px 32px; background: #13162a; text-align: center; color: #555; font-size: 11px;">
        MerkadAgency &bull; www.merkadagency.com &bull; Contract ${contract.contractNumber}
    </div>

</div>
</body>
</html>
    `.trim();
}
