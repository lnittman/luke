import { NextRequest } from 'next/server';
import { GET } from '../route';
import { get } from '@vercel/blob';

// Mock @vercel/blob
jest.mock('@vercel/blob', () => ({
  get: jest.fn(),
}));

describe('/api/tech/docs/[name] endpoint', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return tech documentation when specific doc exists', async () => {
    // Mock the Blob API to return a specific document
    (get as jest.Mock).mockResolvedValueOnce({
      text: '# React Documentation\n\nReact is a JavaScript library for building user interfaces.'
    });

    const request = new NextRequest('http://localhost:3000/api/tech/docs/react');
    const response = await GET(request, { params: { name: 'react' } });
    const data = await response.json();

    expect(get).toHaveBeenCalledWith('tech-react.md');
    expect(response.status).toBe(200);
    expect(data.content).toContain('React is a JavaScript library');
  });

  it('should fall back to tech.md when specific doc does not exist', async () => {
    // Mock the Blob API to throw for specific doc but return for main tech.md
    (get as jest.Mock)
      .mockRejectedValueOnce(new Error('Not found'))
      .mockResolvedValueOnce({
        text: '# Tech Documentation\n\n## react\n\nReact is a JavaScript library.'
      });

    const request = new NextRequest('http://localhost:3000/api/tech/docs/react');
    const response = await GET(request, { params: { name: 'react' } });
    const data = await response.json();

    expect(get).toHaveBeenCalledWith('tech-react.md');
    expect(get).toHaveBeenCalledWith('tech.md');
    expect(response.status).toBe(200);
    expect(data.content).toContain('React is a JavaScript library');
  });

  it('should return 404 when tech is not found anywhere', async () => {
    // Mock the Blob API to throw for both specific doc and not find in main tech.md
    (get as jest.Mock)
      .mockRejectedValueOnce(new Error('Not found'))
      .mockResolvedValueOnce({
        text: '# Tech Documentation\n\n## nextjs\n\nNext.js is a React framework.'
      });

    const request = new NextRequest('http://localhost:3000/api/tech/docs/unknown-tech');
    const response = await GET(request, { params: { name: 'unknown-tech' } });
    
    expect(response.status).toBe(404);
  });
}); 