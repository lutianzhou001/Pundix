import { Controller, Post } from '@nestjs/common';
import { IResponse } from '../common/interfaces/response.interface';
import { ResponseError, ResponseSuccess } from '../common/dto/response.dto';
import { FetchService } from './fetch.service';

@Controller('fetch')
export class FetchController {
    constructor(private readonly fetchService: FetchService) {}

    @Post('tokens')
    async getTokens(): Promise<IResponse> {
        try {
            return new ResponseSuccess(
                'FETCH_SUCCESS',
                await this.fetchService.getTokens(),
            );
        } catch (e) {
            return new ResponseError('FETCH_ERROR', (e as Error).message);
        }
    }
}
