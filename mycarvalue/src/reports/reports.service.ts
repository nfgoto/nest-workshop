import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { Report } from './report.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private repo: Repository<Report>
  ) { }

  async create(reportDto: CreateReportDto, currentUser: User): Promise<Report> {
    const report = this.repo.create(reportDto);
    report.user = currentUser;
    return this.repo.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.repo.findOne(id);
    if (!report) {
      throw new NotFoundException('User not found');
    }
    report.approved = approved;
    return this.repo.save(report);
  }

  async createEstimate({ make, model, lng, lat, year, mileage }: GetEstimateDto) {
    return this.repo.createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng }) // subtract lng of every single row by lng of dto
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat }) // subtract lat of every single row by lat of dto
      .andWhere('year - :year BETWEEN -5 AND 5', { year }) // subtract year of every single row by year of dto
      .andWhere('approved IS TRUE')
      .orderBy('ABS(mileage - :mileage)', 'DESC').setParameters({ mileage })
      .limit(3)
      .getRawOne()
  }
}
