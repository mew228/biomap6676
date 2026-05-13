const API_BASE = 'http://localhost:8000';

export const ingestDocument = async (raw_text) => {
    const response = await fetch(`${API_BASE}/ingest`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ raw_text }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to ingest document');
    }

    return response.json();
};

export const searchDocuments = async (query, province) => {
    const response = await fetch(`${API_BASE}/search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, province }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to search documents');
    }

    return response.json();
};
