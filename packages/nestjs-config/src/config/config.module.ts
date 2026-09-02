import type { DynamicModule, Provider } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';
import type { z, ZodType } from 'zod';

export const ENV = Symbol('ENV');

type ConfigModuleOptions<Schema extends ZodType> = {
  providers: Provider[];
  validationSchema: Schema;
};

@Global()
@Module({})
export class ConfigModule {
  static forRoot<Schema extends ZodType>(options: ConfigModuleOptions<Schema>): DynamicModule {
    const { validationSchema } = options;

    const parsed = validationSchema.safeParse(process.env);

    if (!parsed.success) {
      const issues = parsed.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}. Value: ${String(issue.input)}`)
        .join('\n');

      throw new Error(`Env validation error: ${issues}`);
    }

    type EnvType = z.infer<Schema>;
    const validatedEnv: EnvType = parsed.data;

    // Replaces process.env wholesale so zod-coerced values keep their parsed types.
    // See the caveat in the README before relying on this.
    process.env = validatedEnv as unknown as NodeJS.ProcessEnv;

    return {
      module: ConfigModule,
      providers: [...options.providers, { provide: ENV, useValue: validatedEnv }],
      exports: options.providers,
    };
  }
}
