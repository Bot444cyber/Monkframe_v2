const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000';

class GoogleDriveService {
    private getHeaders() {
        const token = localStorage.getItem('auth_token');
        return {
            'Authorization': token ? `Bearer ${token}` : '',
        };
    }

    async listFiles() {
        const response = await fetch(`${API_URL}/api/admin/drive/files`, {
            headers: this.getHeaders(),
        });
        return response.json();
    }

    async uploadFile(file: File) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_URL}/api/admin/drive/files`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: formData,
        });
        return response.json();
    }

    async renameFile(id: string, name: string) {
        const response = await fetch(`${API_URL}/api/admin/drive/files/${id}`, {
            method: 'PATCH',
            headers: {
                ...this.getHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name }),
        });
        return response.json();
    }

    async deleteFile(id: string) {
        const response = await fetch(`${API_URL}/api/admin/drive/files/${id}`, {
            method: 'DELETE',
            headers: this.getHeaders(),
        });
        return response.json();
    }
}

export const googleDriveService = new GoogleDriveService();
