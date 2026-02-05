export default function buildParams(params: Record<string, string | number | undefined | string[]>) {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
            if (Array.isArray(value)) {
                queryParams.append(key, value.join(","))
            } else {
                queryParams.append(key, value.toString())
            }
        }
    })
    return queryParams.toString()
}