import { Datum, type DatumDefinition, DatumInvalidTypeError } from '../../model';

export const NumberTypeID = 'number';

export class RNumber extends Datum<number> {
  static readonly defn: DatumDefinition = {
    id: NumberTypeID,
    name: 'Number',
    description: 'Just a number, either integer or with a floating point.',
  };

  get defn(): DatumDefinition {
    return RNumber.defn;
  }

  get ctor() {
    return RNumber;
  }

  static fromJSON(value: unknown): number {
    switch (typeof value) {
      case 'number':
        return value;

      default:
        throw new DatumInvalidTypeError('number', value);
    }
  }

  toJSON() {
    return this.value;
  }
}

export function numberSanitizer(rules: { min?: number; max?: number; integer?: boolean }) {
  return (value: number) => {
    let adjusted = value;

    if (typeof rules.min !== 'undefined' && adjusted < rules.min) {
      adjusted = rules.min;
    }

    if (typeof rules.max !== 'undefined' && adjusted > rules.max) {
      adjusted = rules.max;
    }

    if (rules.integer !== undefined) {
      adjusted = Math.floor(adjusted);
    }

    return adjusted;
  };
}
