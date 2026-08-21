import { supabase } from './lib/supabase.js';

const requestForm = document.querySelector('.request-form');
const status = requestForm.querySelector('.request-status');
const submitButton = requestForm.querySelector('button[type="submit"]');

document.querySelectorAll('.request-link').forEach(function(link) {
    link.addEventListener('click', function() {
        requestForm.elements.request_type.value = link.dataset.requestType;
    });
});

requestForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    const formData = new FormData(requestForm);
    const requestType = formData.get('request_type');
    const project = formData.get('project') || 'Smart Table Starter Kit';
    const phone = formData.get('phone');
    const message = formData.get('message') || 'Smart Table request';

    submitButton.disabled = true;
    status.classList.remove('error');
    status.textContent = 'Sending...';

    const { error } = await supabase.from('contact_messages').insert({
        name: formData.get('name'),
        email: formData.get('email'),
        project: requestType + ' - ' + project + (phone ? ' - Phone: ' + phone : ''),
        message
    });

    submitButton.disabled = false;
    if (error) {
        status.classList.add('error');
        status.textContent = 'Unable to send. Please check your details and try again.';
        console.error('Smart Table request failed:', error);
        return;
    }

    status.textContent = 'Request received. We will be in touch shortly.';
    requestForm.reset();
});