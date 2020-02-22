## run stesp ##
export GOOGLE_APPLICATION_CREDENTIALS="/c/tennis.json" && firebase functions:shell

## trigger update ##
usersTrigger(
{
  before: { avatarUrl: '' },
  after: {
    avatarUrl: 'someimage',
    groups: { '588k0Uv6SQhzNareyjKK': true, 'bSqxC8rBohgr9iQPYQ2s' : true }
  }
},
{ params: { userId: 'kbQqN2P9W8NTsdlTi4J3O6IhAC12' } })

## this should not trigger update ##
usersTrigger(
{
  before: { avatarUrl: '' },
  after: {
    avatarUrl: '',
    groups: { '588k0Uv6SQhzNareyjKK': true, 'bSqxC8rBohgr9iQPYQ2s' : true }
  }
},
{ params: { userId: 'kbQqN2P9W8NTsdlTi4J3O6IhAC12' } })

## this should not trigger update ##
usersTrigger(
{
  before: { avatarUrl: '' },
  after: {
    avatarUrl: '',
  }
},
{ params: { userId: 'kbQqN2P9W8NTsdlTi4J3O6IhAC12' } })

## groups not exist ##
usersTrigger(
{
  before: { avatarUrl: '' },
  after: {
    avatarUrl: '',
    groups: { 'invalidgroupid': true }
  }
},
{ params: { userId: 'kbQqN2P9W8NTsdlTi4J3O6IhAC12' } })
