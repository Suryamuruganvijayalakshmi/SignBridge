import { supabase } from './lib/supabase.js';

const requestForm = document.querySelector('.request-form');

if (requestForm) {
    const status = requestForm.querySelector('.request-status');
    const submitButton = requestForm.querySelector('button[type="submit"]');

    document.querySelectorAll('.request-link').forEach(function(link) {
        link.addEventListener('click', function() {
            if (requestForm.elements.request_type) {
                requestForm.elements.request_type.value = link.dataset.requestType;
            }
        });
    });

    requestForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const formData = new FormData(requestForm);
        const requestType = formData.get('request_type');
        const project = formData.get('project') || 'Smart Table Starter Kit';
        const phone = formData.get('phone');
        const message = formData.get('message') || 'Smart Table request';

        if (submitButton) submitButton.disabled = true;
        if (status) {
            status.classList.remove('error');
            status.textContent = 'Sending...';
        }

        let error;
        try {
            const res = await supabase.from('contact_messages').insert({
                name: formData.get('name'),
                email: formData.get('email'),
                project: requestType + ' - ' + project + (phone ? ' - Phone: ' + phone : ''),
                message
            });
            error = res.error;
        } catch (err) {
            error = err;
        }

        if (submitButton) submitButton.disabled = false;
        if (error) {
            if (status) {
                status.classList.add('error');
                status.textContent = 'Unable to send. Please check your details and try again.';
            }
            console.error('Smart Table request failed:', error);
            return;
        }

        if (status) status.textContent = 'Request received. We will be in touch shortly.';
        requestForm.reset();
    });
}