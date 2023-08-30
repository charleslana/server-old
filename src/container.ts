import { container } from 'tsyringe';
import { GroupInvitationService } from './service/GroupInvitationService';
import { GroupService } from './service/GroupService';
import { UserCharacterGroupService } from './service/UserCharacterGroupService';
import { UserCharacterService } from './service/UserCharacterService';

container.register(GroupService, { useClass: GroupService });

container.register(UserCharacterGroupService, {
  useClass: UserCharacterGroupService,
});

container.register(UserCharacterService, {
  useClass: UserCharacterService,
});

container.register(GroupInvitationService, {
  useClass: GroupInvitationService,
});

export { container };
