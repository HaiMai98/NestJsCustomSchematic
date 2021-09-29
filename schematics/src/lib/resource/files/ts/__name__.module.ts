import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { <%= classify(name) %>Service } from './<%= name %>.service';
import { 
  <%= classify(name) %>Schema,
  <%= classify(name) %>_MODEL,
} from './entities/<%= name %>.entity';
<% if (type === 'rest' || type === 'microservice') { %>import { <%= classify(name) %>Controller } from './<%= name %>.controller';<% } %><% if (type === 'graphql-code-first' || type === 'graphql-schema-first') { %>import { <%= classify(name) %>Resolver } from './<%= name %>.resolver';<% } %><% if (type === 'ws') { %>import { <%= classify(name) %>Gateway } from './<%= name %>.gateway';<% } %>

@Module({
  imports: [ MongooseModule.forFeature([
    { name: <%= classify(name) %>_MODEL, schema: <%= classify(name) %>Schema},
    ]),
  ],
  <% if (type === 'rest' || type === 'microservice') { %>controllers: [<%= classify(name) %>Controller],
  providers: [<%= classify(name) %>Service]<% } else if (type === 'graphql-code-first' || type === 'graphql-schema-first') { %>providers: [<%= classify(name) %>Resolver, <%= classify(name) %>Service]<% } else { %>providers: [<%= classify(name) %>Gateway, <%= classify(name) %>Service]<% } %>
  exports: [<%= classify(name) %>Service],
})
export class <%= classify(name) %>Module {}
