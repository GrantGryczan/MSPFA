// This file is automatically generated by `scripts/generate-validators`. Do not edit directly.

import { createValidator } from 'modules/server/api';

export default createValidator({
	$schema: 'http://json-schema.org/draft-07/schema#',
	$ref: '#/definitions/RequestMethod',
	definitions: {
		RequestMethod: {
			type: 'string',
			enum: [
				'GET',
				'PUT'
			]
		}
	}
}, {
	$schema: 'http://json-schema.org/draft-07/schema#',
	$ref: '#/definitions/Request',
	definitions: {
		'Request': {
			anyOf: [
				{
					type: 'object',
					additionalProperties: false,
					properties: {
						body: {},
						query: {
							type: 'object',
							properties: {
								storyID: {
									type: 'string'
								}
							},
							required: [
								'storyID'
							],
							additionalProperties: false
						},
						method: {
							type: 'string',
							const: 'GET'
						}
					},
					required: [
						'method',
						'query'
					]
				},
				{
					type: 'object',
					additionalProperties: false,
					properties: {
						body: {
							$ref: '#/definitions/RecursivePartial%3C(alias-731470504-70254-70395-731470504-0-212312%3Cdef-alias--974-1312--0-21271904767254%2Calias--795-1150--0-52631840202528%3E%26structure--1323-1470--1285-1470--1267-1471--1259-1471--1240-1474--1216-1474--1214-1476--1178-1476--1166-1570--1157-5237--1150-5237--1150-5238--0-5263)%3E'
						},
						query: {
							type: 'object',
							properties: {
								storyID: {
									type: 'string'
								}
							},
							required: [
								'storyID'
							],
							additionalProperties: false
						},
						method: {
							type: 'string',
							const: 'PUT'
						}
					},
					required: [
						'body',
						'method',
						'query'
					]
				}
			]
		},
		'RecursivePartial<(alias-731470504-70254-70395-731470504-0-212312<def-alias--974-1312--0-21271904767254,alias--795-1150--0-52631840202528>&structure--1323-1470--1285-1470--1267-1471--1259-1471--1240-1474--1216-1474--1214-1476--1178-1476--1166-1570--1157-5237--1150-5237--1150-5238--0-5263)>': {
			type: 'object',
			properties: {
				title: {
					type: 'string',
					minLength: 1,
					maxLength: 50
				},
				status: {
					$ref: '#/definitions/StoryStatus'
				},
				privacy: {
					$ref: '#/definitions/StoryPrivacy'
				},
				owner: {
					type: 'string'
				},
				editors: {
					$ref: '#/definitions/RecursivePartial%3Cstring%5B%5D%3E'
				},
				author: {
					$ref: '#/definitions/RecursivePartial%3C(structure--2150-2194--2140-2195--1191-2895--1162-2896--0-7445%7Cundefined)%3E'
				},
				description: {
					type: 'string',
					maxLength: 2000
				},
				blurb: {
					type: 'string',
					maxLength: 500
				},
				icon: {
					anyOf: [
						{
							type: 'string',
							const: ''
						},
						{
							$ref: '#/definitions/URLString'
						}
					]
				},
				banner: {
					anyOf: [
						{
							type: 'string',
							const: ''
						},
						{
							$ref: '#/definitions/URLString'
						}
					]
				},
				style: {
					type: 'string'
				},
				disableUserTheme: {
					type: 'boolean',
					description: "Whether the story should ignore the reader's theme setting."
				},
				tags: {
					$ref: '#/definitions/RecursivePartial%3Cdef-alias--488-608--0-74451228754883%5B%5D2102017445%3E'
				},
				commentsEnabled: {
					type: 'boolean'
				},
				editorSettings: {
					$ref: '#/definitions/RecursivePartial%3Cstructure--2749-2852--2659-2853--1191-2895--1162-2896--0-7445281038569%3E'
				},
				colors: {
					$ref: '#/definitions/RecursivePartial%3Cdef-alias--1101-1162--0-7445%5B%5D%3E'
				},
				quirks: {
					$ref: '#/definitions/RecursivePartial%3Cdef-alias--82-157--0-157%5B%5D%3E'
				},
				willDelete: {
					type: 'boolean'
				},
				anniversary: {
					$ref: '#/definitions/RecursivePartial%3Cindexed-type-731470504-70368-70394-731470504-70254-70395-731470504-0-212312%3Cstructure--1502-1845--1364-1846--1191-2895--1162-2896--0-7445%2Calias-731470504-70528-70643-731470504-0-212312%3C(%22year%22%7C%22month%22%7C%22day%22%7C%22changed%22)%2C%22changed%22%3E%3E%3E'
				},
				script: {
					$ref: '#/definitions/RecursivePartial%3Cindexed-type-731470504-70368-70394-731470504-70254-70395-731470504-0-212312%3Cstructure--2516-2562--2507-2563--1191-2895--1162-2896--0-7445%2C%22unverified%22%3E%3E'
				}
			},
			additionalProperties: false
		},
		'StoryStatus': {
			type: 'number',
			enum: [
				0,
				1,
				2,
				3
			]
		},
		'StoryPrivacy': {
			type: 'number',
			enum: [
				0,
				1,
				2
			]
		},
		'RecursivePartial<string[]>': {
			type: 'array',
			items: {
				type: 'string'
			}
		},
		'RecursivePartial<(structure--2150-2194--2140-2195--1191-2895--1162-2896--0-7445|undefined)>': {
			type: 'object',
			properties: {
				name: {
					type: 'string'
				},
				site: {
					anyOf: [
						{
							type: 'string',
							const: ''
						},
						{
							$ref: '#/definitions/URLString'
						}
					]
				}
			},
			additionalProperties: false
		},
		'URLString': {
			type: 'string',
			pattern: '^https?://'
		},
		'RecursivePartial<def-alias--488-608--0-74451228754883[]2102017445>': {
			type: 'array',
			items: {
				$ref: '#/definitions/TagString'
			}
		},
		'TagString': {
			type: 'string',
			minLength: 1,
			maxLength: 50,
			pattern: '^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$'
		},
		'RecursivePartial<structure--2749-2852--2659-2853--1191-2895--1162-2896--0-7445281038569>': {
			type: 'object',
			properties: {
				defaultPageTitle: {
					type: 'string'
				},
				defaultSpoiler: {
					$ref: '#/definitions/RecursivePartial%3Cstructure--2809-2849--2791-2849--2749-2852--2659-2853--1191-2895--1162-2896--0-7445%3E'
				}
			},
			additionalProperties: false
		},
		'RecursivePartial<structure--2809-2849--2791-2849--2749-2852--2659-2853--1191-2895--1162-2896--0-7445>': {
			type: 'object',
			properties: {
				open: {
					type: 'string'
				},
				close: {
					type: 'string'
				}
			},
			additionalProperties: false
		},
		'RecursivePartial<def-alias--1101-1162--0-7445[]>': {
			type: 'array',
			items: {
				$ref: '#/definitions/RecursivePartial%3CStoryColor%3E'
			}
		},
		'RecursivePartial<StoryColor>': {
			type: 'object',
			properties: {
				value: {
					type: 'string'
				},
				name: {
					type: 'string'
				}
			},
			additionalProperties: false
		},
		'RecursivePartial<def-alias--82-157--0-157[]>': {
			type: 'array',
			items: {
				$ref: '#/definitions/RecursivePartial%3CQuirk%3E'
			}
		},
		'RecursivePartial<Quirk>': {
			type: 'object',
			properties: {
				name: {
					type: 'string'
				},
				replacements: {
					$ref: '#/definitions/RecursivePartial%3Cdef-alias--0-82--0-157%5B%5D%3E'
				}
			},
			additionalProperties: false
		},
		'RecursivePartial<def-alias--0-82--0-157[]>': {
			type: 'array',
			items: {
				$ref: '#/definitions/RecursivePartial%3CQuirkReplacement%3E'
			}
		},
		'RecursivePartial<QuirkReplacement>': {
			type: 'object',
			properties: {
				from: {
					type: 'string'
				},
				fromFlags: {
					type: 'string'
				},
				to: {
					type: 'string'
				}
			},
			additionalProperties: false
		},
		'RecursivePartial<indexed-type-731470504-70368-70394-731470504-70254-70395-731470504-0-212312<structure--1502-1845--1364-1846--1191-2895--1162-2896--0-7445,alias-731470504-70528-70643-731470504-0-212312<("year"|"month"|"day"|"changed"),"changed">>>': {
			type: 'object',
			properties: {
				year: {
					type: 'number'
				},
				month: {
					type: 'number',
					minimum: 0,
					maximum: 11
				},
				day: {
					type: 'number',
					description: "The anniversary's day of the month.",
					minimum: 1
				}
			},
			additionalProperties: false
		},
		'RecursivePartial<indexed-type-731470504-70368-70394-731470504-70254-70395-731470504-0-212312<structure--2516-2562--2507-2563--1191-2895--1162-2896--0-7445,"unverified">>': {
			type: 'object',
			properties: {
				unverified: {
					type: 'string'
				}
			},
			additionalProperties: false
		}
	}
});