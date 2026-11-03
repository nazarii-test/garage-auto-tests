import { test, expect } from '@playwright/test';

test('Get all posts', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts');
    const posts = await response.json();
    expect(response.status()).toBe(200);
    expect(posts).toHaveLength(100);
})

test('Create new post', async ({ request }) => {
    const newPost = {
        title: 'foo',
        body: 'bar',
        userId: 1,
    };

    const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
        data: newPost
    });

    const createdPost = await response.json();
    expect(response.status()).toBe(201);
    expect(createdPost.title).toBe(newPost.title);
    expect(createdPost.body).toBe(newPost.body);
    expect(createdPost.userId).toBe(newPost.userId);
})

test('Update a post', async ({ request }) => {
    const newPost = {
        title: 'foo',
        body: 'bar',
        userId: 1,
    };

    const response = await request.put('https://jsonplaceholder.typicode.com/posts/5', {
        data: newPost
    });

    const updatedPost = await response.json();

    expect(response.status()).toBe(200);
    expect(updatedPost.title).toBe(newPost.title);
    expect(updatedPost.body).toBe(newPost.body);
    expect(updatedPost.userId).toBe(newPost.userId);
})

test('Delete a post', async ({ request }) => {
    const response = await request.delete('https://jsonplaceholder.typicode.com/posts/5353');
    expect(response.status()).toBe(200);
})