import { NextResponse, NextRequest } from "next/server";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_MODELS_URL = "https://models.github.ai/inference/chat/completions";

export async function POST(req: NextRequest) {
    try {
        if (!GITHUB_TOKEN) {
            return NextResponse.json(
                { error: "Server misconfiguration: GITHUB_TOKEN environment variable is missing." },
                { status: 500 }
            );
        }

        const { campaignName, campaignType, stepNumber, physician } = await req.json();

        if (!campaignName || !campaignType || !stepNumber) {
            return NextResponse.json(
                { error: "Missing required fields: campaignName, campaignType, stepNumber" },
                { status: 400 }
            );
        }

        const typeLabel =
            campaignType === "cold_outbound" ? "Cold Outreach" :
            campaignType === "reengagement" ? "Re-engagement" :
            "Conference Follow-up";

        const physicianContext = physician
            ? `\nTarget Physician Profile (use this to personalize the tone and content):
            - Name: Dr. ${physician.name}
            - Specialty: ${physician.specialty}
            - Affiliation: ${physician.affiliation}
            - City: ${physician.city || "N/A"}`
                        : "";

        const prompt = `You are an expert Medical Science Liaison (MSL) or Pharma Marketing Manager writing an outreach email to a physician.

            Generate a professional, compliant outreach email for the following campaign:
            - Campaign Name: "${campaignName}"
            - Campaign Type: ${typeLabel}
            - This is Step ${stepNumber} of the sequence${stepNumber > 1 ? " (a follow-up email sent if the physician did not reply to the previous step)" : " (the initial contact email)"}.
            ${physicianContext}

            IMPORTANT RULES:
            1. Use these exact template variables as placeholders for the recipient (do NOT replace them with real values):
            - {{doctor_name}} for the physician's name
            - {{specialty}} for their medical specialty
            - {{affiliation}} for their hospital/health system
            2. Even though a specific physician profile is provided for context, you MUST still use the {{template_variables}} above so the email works as a reusable template for all enrolled physicians.
            3. Always start the email with exactly: "Dear Dr. {{doctor_name}},"
            4. Sign off the email using the exact template variables for the sender, exactly like this:
               "Best regards,
               {{sender_name}}
               {{sender_title}}
               {{sender_company}}"
            5. Do NOT mention "DocNexus" in the email body. DocNexus is just the software being used to send the email; the email itself is from a pharma company to a doctor.
            6. Use the physician's specialty and affiliation context to make the email content more relevant and specific to that medical field.
            7. The tone should be professional, respectful, and concise — suitable for healthcare professionals.
            8. Keep the email body to 4-6 sentences maximum.
            9. Do NOT include any HTML tags. Use \\n for line breaks.

            Respond with a valid JSON object in this format:
            {
            "subjectTemplate": "your subject line here",
            "bodyTemplate": "your email body here"
            }`;

        // Calling GitHub Models using standard fetch (OpenAI compatible)
        const response = await fetch(GITHUB_MODELS_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GITHUB_TOKEN}`,
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "user", content: prompt }
                ],
                // Enforces a strict JSON object response
                response_format: { type: "json_object" }
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("GitHub Models API returned an error:", errorText);
            return NextResponse.json(
                { error: `Inference failed: ${response.statusText}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        const contentString = data.choices?.[0]?.message?.content;

        if (!contentString) {
            throw new Error("Empty response returned from GitHub Models API.");
        }

        // Because of response_format: { type: "json_object" }, parsing is safe
        const parsed = JSON.parse(contentString);

        return NextResponse.json({
            subjectTemplate: parsed.subjectTemplate,
            bodyTemplate: parsed.bodyTemplate,
        });

    } catch (error: any) {
        console.error("API Route execution failed:", error);
        return NextResponse.json(
            { error: "Failed to generate email. Please try again." },
            { status: 500 }
        );
    }
}