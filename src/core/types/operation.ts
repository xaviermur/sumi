export type OperationType = "sum" | "sub" | "mul" | "div";

export interface Operation {
  num1: number;
  num2: number;
  opType: OperationType;
  result: number;
}

export interface LastResult extends Operation {
  given: number;
  success: boolean;
}

export interface GenerateOperationOptions {
  type?: OperationType[];
  range1?: [number, number];
  range2?: [number, number];
  overflowDigits?: [number, number];
  multipleOf1?: number | null;
  multipleOf2?: number | null;
  resultRange?: [number, number];
}
