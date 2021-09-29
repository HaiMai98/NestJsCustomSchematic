import { Injectable } from '@nestjs/common';<% if (crud && type !== 'graphql-code-first' && type !== 'graphql-schema-first') { %>
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose-paginate-v2';
import { Create<%= singular(classify(name)) %>Dto } from './dto/create-<%= singular(name) %>.dto';
import { Update<%= singular(classify(name)) %>Dto } from './dto/update-<%= singular(name) %>.dto';<% } else if (crud) { %>
import { Create<%= singular(classify(name)) %>Input } from './dto/create-<%= singular(name) %>.input';
import { Update<%= singular(classify(name)) %>Input } from './dto/update-<%= singular(name) %>.input';<% } %>
import { 
  <%= classify(name) %>_MODEL,
} from './entities/<%= name %>.entity';
import { I<%= classify(name) %>Doc } from './home-templates.interface';

@Injectable()
export class <%= classify(name) %>Service {<% if (crud) { %>
  constructor(
    @InjectModel(<%= classify(name) %>_MODEL)
    private readonly <%= classify(name) %>Model: PaginateModel<I<%= classify(name) %>Doc>,
  ) {}

  create(<% if (type !== 'graphql-code-first' && type !== 'graphql-schema-first') { %>create<%= singular(classify(name)) %>Dto: Create<%= singular(classify(name)) %>Dto<% } else { %>create<%= singular(classify(name)) %>Input: Create<%= singular(classify(name)) %>Input<% } %>) {
    return this.<%= classify(name) %>Model.create(create<%= singular(classify(name)) %>Dto);
  }

  findAll() {
    return this.<%= classify(name) %>Model.find();
  }

  findOne(id: string) {
    return this.<%= classify(name) %>Model.findById(id);
  }

  update(id: string, <% if (type !== 'graphql-code-first' && type !== 'graphql-schema-first') { %>update<%= singular(classify(name)) %>Dto: Update<%= singular(classify(name)) %>Dto<% } else { %>update<%= singular(classify(name)) %>Input: Update<%= singular(classify(name)) %>Input<% } %>) {
    return this.<%= classify(name) %>Model.update({_id: id}, update<%= singular(classify(name)) %>Dto );
  }

  remove(id: string) {
    return this.<%= classify(name) %>Model.findOneAndDelete({ _id: id });
  }
<% } %>}
