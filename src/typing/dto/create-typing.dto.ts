import { IsNumber, IsString, Min, Max } from 'class-validator';

export class CreateTestDto {
  @IsNumber()
  @Min(0)
  wpm: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  accuracy: number;

  @IsNumber()
  @Min(0)
  score: number;

  @IsNumber()
  @Min(0)
  wordsTyped: number;

  @IsNumber()
  @Min(0)
  timeSpent: number;

  @IsNumber()
  @Min(0)
  mistakes: number;

  @IsString()
  text: string;
}
