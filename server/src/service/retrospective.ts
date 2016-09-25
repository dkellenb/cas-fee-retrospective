import { injectable } from 'inversify';
import { IRetrospective } from '../../../shared/src/model/retrospective';

@injectable()
export class RetrospectiveService {

  private retrospectiveStorage: IRetrospective[] = [];

  public getRetrospectives(): IRetrospective[] {
    return this.retrospectiveStorage;
  }

  public getRetrospective(id: string): IRetrospective {
    let result: IRetrospective;
    this.retrospectiveStorage.map(retrospective => {
      if (retrospective.uuid.getId() === id) {
        result = retrospective;
      }
    });

    return result;
  }

  public createRetrospective(retrospective: IRetrospective): IRetrospective {
    this.retrospectiveStorage.push(retrospective);
    return retrospective;
  }

  public updateRetrospective(id: string, retrospective: IRetrospective): IRetrospective {
    this.retrospectiveStorage.map((entry, index) => {
      if (entry.uuid.getId() === id) {
        this.retrospectiveStorage[index] = retrospective;
      }
    });

    return retrospective;
  }

  public deleteRetrospective(id: string): string {
    let updatedRetrospective: IRetrospective[] = [];
    this.retrospectiveStorage.map(retrospective => {
      if (retrospective.uuid.getId() !== id) {
        updatedRetrospective.push(retrospective);
      }
    });

    this.retrospectiveStorage = updatedRetrospective;
    return id;
  }

}
