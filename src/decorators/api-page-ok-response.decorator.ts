import type { Type } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

import { PageDto } from '@common/abstract/dto/page.dto';

/**
 * For swagger ui returns response schema and description
 * @param options
 * @constructor
 */
export function ApiPageOkResponse<T extends Type>(options: {
    type: T;
    description?: string;
}): MethodDecorator {
    return applyDecorators(
        ApiExtraModels(PageDto),
        ApiExtraModels(options.type),
        ApiOkResponse({
            description: options.description,
            schema: {
                allOf: [
                    { $ref: getSchemaPath(PageDto) },
                    {
                        properties: {
                            results: {
                                type: 'array',
                                items: { $ref: getSchemaPath(options.type) },
                            },
                        },
                    },
                ],
            },
        }),
    );
}
