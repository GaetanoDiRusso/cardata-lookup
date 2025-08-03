import { ScrapingResult, ScrapingResultPrev } from '../../domain/entities/ScrapingResult';
import { IScrapingResultRepository, ICreateScrapingResultData, IUpdateScrapingResultData } from '../../domain/interfaces/IScrapingResultRepository';
import { ScrapingType, ScrapingStatus } from '@/models/PScrapingResult';

export class ScrapingResultRepositoryMockImp implements IScrapingResultRepository {
  private scrapingResults: Map<string, ScrapingResult> = new Map();

  async create(data: ICreateScrapingResultData): Promise<ScrapingResult> {
    const id = `scraping_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    
    const scrapingResult = new ScrapingResult(
      id,
      data.folderId,
      data.scrapingType,
      data.status,
      data.data || {},
      data.mediaUrls || [],
      now,
      now,
      data.retryCount || 0,
      data.maxRetries || 3,
      data.metadata,
    );

    this.scrapingResults.set(id, scrapingResult);
    return scrapingResult;
  }

  async findById(id: string): Promise<ScrapingResult | null> {
    return this.scrapingResults.get(id) || null;
  }

  async findByFolderId(folderId: string): Promise<ScrapingResult[]> {
    return Array.from(this.scrapingResults.values())
      .filter(result => result.folderId === folderId);
  }

  async findByFolderIdAndType(folderId: string, scrapingType: ScrapingType): Promise<ScrapingResult | null> {
    const results = Array.from(this.scrapingResults.values())
      .filter(result => result.folderId === folderId && result.scrapingType === scrapingType);
    
    return results.length > 0 ? results[0] : null;
  }

  async findAllPrevByFolderId(folderId: string): Promise<ScrapingResultPrev[]> {
    const results = await this.findByFolderId(folderId);
    return results.map(result => result.toPrev());
  }

  async findByStatus(status: ScrapingStatus): Promise<ScrapingResult[]> {
    return Array.from(this.scrapingResults.values())
      .filter(result => result.status === status);
  }

  async findByType(scrapingType: ScrapingType): Promise<ScrapingResult[]> {
    return Array.from(this.scrapingResults.values())
      .filter(result => result.scrapingType === scrapingType);
  }

  async update(id: string, data: IUpdateScrapingResultData): Promise<ScrapingResult> {
    const existing = this.scrapingResults.get(id);
    if (!existing) {
      throw new Error(`ScrapingResult with id ${id} not found`);
    }

    const updated = new ScrapingResult(
      existing.id,
      existing.folderId,
      existing.scrapingType,
      data.status || existing.status,
      data.data || existing.data,
      data.mediaUrls || existing.mediaUrls,
      existing.createdAt,
      new Date(),
      existing.retryCount,
      existing.maxRetries,
      data.metadata || existing.metadata,
      data.startedAt || existing.startedAt,
      data.completedAt || existing.completedAt,
    );

    this.scrapingResults.set(id, updated);
    return updated;
  }

  async updateStatus(id: string, status: ScrapingStatus): Promise<ScrapingResult> {
    return await this.update(id, { status });
  }

  async incrementRetryCount(id: string): Promise<ScrapingResult> {
    const existing = this.scrapingResults.get(id);
    if (!existing) {
      throw new Error(`ScrapingResult with id ${id} not found`);
    }

    const updated = new ScrapingResult(
      existing.id,
      existing.folderId,
      existing.scrapingType,
      existing.status,
      existing.data,
      existing.mediaUrls,
      existing.createdAt,
      new Date(),
      existing.retryCount + 1,
      existing.maxRetries,
      existing.metadata,
      existing.startedAt,
      existing.completedAt,
    );

    this.scrapingResults.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.scrapingResults.delete(id);
  }

  async deleteByFolderId(folderId: string): Promise<void> {
    const results = await this.findByFolderId(folderId);
    results.forEach(result => this.scrapingResults.delete(result.id));
  }

  async existsByFolderIdAndType(folderId: string, scrapingType: ScrapingType): Promise<boolean> {
    const result = await this.findByFolderIdAndType(folderId, scrapingType);
    return result !== null;
  }

  async countByFolderId(folderId: string): Promise<number> {
    const results = await this.findByFolderId(folderId);
    return results.length;
  }

  async countByStatus(status: ScrapingStatus): Promise<number> {
    const results = await this.findByStatus(status);
    return results.length;
  }
} 