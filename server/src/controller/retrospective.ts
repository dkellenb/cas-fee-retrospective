import { Controller, Get, Post, Put, Delete } from 'inversify-express-utils';
import { injectable, inject } from 'inversify';
import { Request } from 'express';
import TYPES from '../constant/types';
import { IRetrospective } from '../../../shared/src/model/retrospective';
import { RetrospectiveService } from '../service/retrospective';

@injectable()
@Controller('/rest/retrospectives')
export class RetrospectiveController {

  constructor(@inject(TYPES.RetrospectiveService) private retrospectiveService: RetrospectiveService) { }

  @Get('/')
  public getRetrospectives(): IRetrospective[] {
    return this.retrospectiveService.getRetrospectives();
  }

  @Post('/')
  public createRetrospective(request: Request): IRetrospective {
    return this.retrospectiveService.createRetrospective(request.body);
  }

  @Get('/:id')
  public getRetrospective(request: Request): IRetrospective {
    return this.retrospectiveService.getRetrospective(request.params.id);
  }

  @Put('/:id')
  public updateRetrospective(request: Request): IRetrospective {
    return this.retrospectiveService.updateRetrospective(request.params.id, request.body);
  }

  @Delete('/:id')
  public deleteRetrospective(request: Request): string {
    return this.retrospectiveService.deleteRetrospective(request.params.id);
  }

}
