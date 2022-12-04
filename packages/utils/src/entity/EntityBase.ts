import { DEFAULT_ENTITY_OPTIONS } from './consts.js';
import {
  EntitySchema,
  EntityInputShape,
  EntityOutputShape,
  IEntityBase,
  EntityInstance,
  EntityOptions,
} from './types.js';

export class EntityBaseImplied<S extends EntitySchema>
  implements IEntityBase<S>
{
  constructor(
    readonly schema: S,
    readonly fields: EntityInputShape<S> | never = {},
    readonly options: EntityOptions = DEFAULT_ENTITY_OPTIONS
  ) {
    if (Object.keys(this.fields).length) {
      Object.assign(this, this.fields);
      this.validate(this.options.shouldThrowOnInitialization);
    }
  }

  /**
   * Convert the instance to a json object based on the schema values
   * @returns json object of the fields in the schema
   */
  toJSON(): EntityOutputShape<S> {
    return this.schema.parse(this);
  }

  /**
   * Return a stringified json object
   * @param spacing number of spacing for fields in the json
   * @returns Return string json object of toJSON method
   */
  toString(spacing = 2) {
    const json = this.toJSON();
    return JSON.stringify(json, undefined, spacing);
  }

  /**
   * Validate the instance against the schema
   * @param shouldThrow throw an error if the validation fails (default false)
   * @returns true
   */
  validate(shouldThrow = false) {
    const result = this.schema.safeParse(this);
    if (!result.success && result.error) {
      if (shouldThrow) {
        throw result.error;
      }

      return result.error;
    }

    if (result.success) {
      Object.assign(this, result.data);
    }

    return true;
  }
}

export type EntityBase<S extends EntitySchema> = EntityInstance<
  S,
  EntityBaseImplied<S>
>;
export type EntityBaseClass = {
  new <S extends EntitySchema>(
    schema: S,
    fields?: EntityInputShape<S> | never,
    options?: EntityOptions
  ): EntityBase<S>;
};
export const EntityBase = EntityBaseImplied as EntityBaseClass;
