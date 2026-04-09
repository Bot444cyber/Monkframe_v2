const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000';

class GoogleDriveService {
    private getHeaders() {
        const token = localStorage.getItem('auth_token');
        return {
            'Authorization': token ? `Bearer ${token}` : '',
        };
    }

    async listFiles(pageSize: number = 20, pageToken?: string) {
        let url = `${API_URL}/api/admin/drive/files?pageSize=${pageSize}`;
        if (pageToken) url += `&pageToken=${pageToken}`;

        const response = await fetch(url, {
            headers: this.getHeaders(),
        });
        return response.json();
    }

    async getStorageUsage() {
        const response = await fetch(`${API_URL}/api/admin/drive/usage`, {
            headers: this.getHeaders(),
        });
        return response.json();
    }

    async bulkDelete(fileIds: string[]) {
        const response = await fetch(`${API_URL}/api/admin/drive/bulk-delete`, {
            method: 'POST',
            headers: {
                ...this.getHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fileIds }),
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
