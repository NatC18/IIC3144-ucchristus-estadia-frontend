import { renderHook, act, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { useFileUpload } from '@/hooks/useExcelUpload'
import { excelUploadService } from '@/services/excelUploadService'

// Mock the excelUploadService
vi.mock('@/services/excelUploadService', () => ({
  excelUploadService: {
    uploadFile: vi.fn(),
  },
}))

const mockUploadFile = excelUploadService.uploadFile as unknown as ReturnType<typeof vi.fn>

describe('useFileUpload', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useFileUpload())

    expect(result.current.isUploading).toBe(false)
    expect(result.current.uploadProgress).toBe(0)
    expect(result.current.error).toBeNull()
    expect(result.current.success).toBe(false)
    expect(result.current.uploadResult).toBeNull()
  })

  it('should upload a file successfully', async () => {
    const mockResult = { message: 'Upload successful' }
    mockUploadFile.mockResolvedValueOnce(mockResult)

    const { result } = renderHook(() => useFileUpload())
    const file = new File(['data'], 'test.xlsx', { type: 'application/vnd.ms-excel' })

    await act(async () => {
      await result.current.uploadFile(file, 'PACIENTES')
    })

    await waitFor(() => {
      expect(result.current.success).toBe(true)
    })

    expect(mockUploadFile).toHaveBeenCalledWith(file, 'PACIENTES')
    expect(result.current.uploadResult).toEqual(mockResult)
    expect(result.current.error).toBeNull()
  })

  it('should handle upload errors correctly', async () => {
    mockUploadFile.mockRejectedValueOnce(new Error('Upload failed'))
    
    const { result } = renderHook(() => useFileUpload())
    const file = new File(['dummy'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

    await expect(result.current.uploadFile(file, 'GESTIONES')).rejects.toThrow('Upload failed')

    await waitFor(() => {
      expect(result.current.error).toBe('Upload failed')
      expect(result.current.isUploading).toBe(false)
      expect(result.current.success).toBe(false)
    })
  })

  it('should reset state when reset() is called', () => {
    const { result } = renderHook(() => useFileUpload())

    act(() => {
      result.current.reset()
    })

    expect(result.current.isUploading).toBe(false)
    expect(result.current.uploadProgress).toBe(0)
    expect(result.current.error).toBeNull()
    expect(result.current.success).toBe(false)
    expect(result.current.uploadResult).toBeNull()
  })
})