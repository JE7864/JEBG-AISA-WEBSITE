# Footer metrics

The public footer uses the same number-only strip as JEBG AI Technologies. Hover and keyboard focus identify the figures; rates are whole-number percentages with the unit in the tooltip. No visible heading or reference date is shown. Narrow screens scroll horizontally.

Counters: visits, enquiries, demos, engaged. Event counters count at most once per page visit. They do not confirm form submission, email sending, a completed request or a sale. Rates divide the event count by recorded page visits. Daily averages use IST calendar days.

This activity series begins on 8 November 2026.

No form values, customer details or cookies are sent to the counter service. Only fixed aggregate counter keys are requested, with credentials and referrers omitted. Production hostname gating prevents preview traffic. Invalid responses and network failures do not fabricate figures or retry uncertain increments. Missing unused event keys are treated as zero only on the provider's confirmed 'Key not found' response.

Run `node tests/footer-metrics.test.cjs`. GitHub Actions runs the same checks on relevant changes.
