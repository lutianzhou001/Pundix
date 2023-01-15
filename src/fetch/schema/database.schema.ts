import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TokenListDocument = TokenList & Document;

@Schema()
export class TokenList {
    @Prop({ type: Object })
    tokenListData: object;

    @Prop()
    timeStamp: number;
}

export const TokenListSchema = SchemaFactory.createForClass(TokenList);
