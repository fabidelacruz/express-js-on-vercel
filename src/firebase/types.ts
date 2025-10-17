export interface MessageRequest {
    title: string,
    body: string,
    imageUrl?: string,
    data?: { key: string, string }
}

export interface MessageResponse {
    messageId?: string,
    success: boolean,
    error?: {
        code: string,
        message: string
    }
}