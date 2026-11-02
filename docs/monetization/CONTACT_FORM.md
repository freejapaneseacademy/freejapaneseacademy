# Academy contact form (November 2, 2026)

Public route: /contact/
Target mailbox: free-japanese-academy@protonmail.com.
Provider: https://formsubmit.co/ (external third-party form-delivery service).

FormSubmit forwards contact messages after the mailbox owner has performed
one-time EMAIL ACTIVATION. This is a real dependency: publishing HTML alone does
not confirm mail delivery. No user credentials or sender API tokens are needed.
The academy owner should submit a legitimate short test using the contact page,
open the activation email in Proton Mail, click the verification link, then send
a second test and confirm delivery (including the spam folder).
Do not claim successful delivery before testing after activation.

Form uses native HTTPS POST, browser validation, a honeypot, provider's default
reCAPTCHA (do not disable), an explicit third-party data processing acknowledgment,
and a plainly visible direct mailto fallback. FormSubmit stores submissions
for up to 30 days per its documentation. Privacy disclosures are linked in the
form and included at /privacy/. Test automation must NOT submit real mail.

Do not expose a fake "message sent" page. Future lessons should keep a visible
/contact/ route in the shared footer and mobile navigation.

Provider documentation: https://formsubmit.co/documentation
