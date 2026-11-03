import { test, expect } from '@playwright/test';

test('Get all posts', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/post');
    const posts = await response.json();
    expect(response.status()).toBe(200);
    expect(posts).toHaveLength(100);
})

test('Create a new post', async ({ request }) => {

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
    console.log(await response.json());
    expect(createdPost.title).toBe(newPost.title);
    expect(createdPost.body).toBe(newPost.body);
    expect(createdPost.userId).toBe(newPost.userId);
});


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
    console.log(await response.json());
    expect(updatedPost.title).toBe(newPost.title);
    expect(updatedPost.body).toBe(newPost.body);
    expect(updatedPost.userId).toBe(newPost.userId);
})



test('Delete a post', async ({ request }) => {

    const response = await request.delete('https://jsonplaceholder.typicode.com/posts/1')
    expect(response.status()).toBe(200);
})