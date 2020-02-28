## run stesp

export GOOGLE_APPLICATION_CREDENTIALS="/c/tennis.json" && firebase functions:shell

## trigger update

usersTrigger(
{
before: { avatarUrl: '' },
after: {
avatarUrl: 'someimage',
groups: { '588k0Uv6SQhzNareyjKK': true, 'bSqxC8rBohgr9iQPYQ2s' : true }
}
},
{ params: { userId: 'kbQqN2P9W8NTsdlTi4J3O6IhAC12' } })

## this should not trigger update

usersTrigger(
{
before: { avatarUrl: '' },
after: {
avatarUrl: '',
groups: { '588k0Uv6SQhzNareyjKK': true, 'bSqxC8rBohgr9iQPYQ2s' : true }
}
},
{ params: { userId: 'kbQqN2P9W8NTsdlTi4J3O6IhAC12' } })

## this should not trigger update

usersTrigger(
{
before: { avatarUrl: '' },
after: {
avatarUrl: '',
}
},
{ params: { userId: 'kbQqN2P9W8NTsdlTi4J3O6IhAC12' } })

## groups not exist

usersTrigger(
{
before: { avatarUrl: '' },
after: {
avatarUrl: '',
groups: { 'invalidgroupid': true }
}
},
{ params: { userId: 'kbQqN2P9W8NTsdlTi4J3O6IhAC12' } })

## testing the new score trigger

scoresTrigger(
{
winners: {
FLDJnQNRuNhV6jPh6WOZQWPKHEB3: true,
JUiZ9HOtW1eLsUTvtndZ: true
},
losers: {
R0YcF7WNYUQolBtbGDKv: true,
Zuw8wJhOlMiKg1h9WOgH: true
},
gameWonByLostTeam: 4  
},
{params: {groupId: '0oiWTODB7i2iXjCIMw1H', tourId: '5UEwlZqwV0aF1OJxfqmb', scoreId: '0UMrglcSCu570jrVrPrh'}
})
