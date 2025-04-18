import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateJobCrewInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
