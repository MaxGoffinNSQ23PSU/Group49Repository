import { test } from 'node:test';
import assert from 'node:assert';

const faqs = [
    {
        question: "Do I need a referral to use a food bank?",
        answer: "Most food banks in Ladywood accept self-referrals."
    },
    {
        question: "Is the food free?",
        answer: "Yes. All food banks listed on this site provide food completely free of charge."
    }
];

test('faqs is an array', () => {
    assert.strictEqual(Array.isArray(faqs), true);
});

test('each faq has a question and answer', () => {
    faqs.forEach(faq => {
        assert.ok(faq.question, 'faq should have a question');
        assert.ok(faq.answer, 'faq should have an answer');
    });
});

test('faqs array is not empty', () => {
    assert.ok(faqs.length > 0);
});