import FirebaseIntegration from './FirebaseIntegration';

export default class UpdateToDoListService {
    execute(toDoList) {
        return new Promise((resolve, reject) => {
            const firebaseIntegration = new FirebaseIntegration((authError) => {
                if (authError) {
                    reject(authError);
                }
    
                const reference = firebaseIntegration.reference;
                reference.doc(toDoList.id).update(toDoList).then(() => {
                    resolve(true);
                }).catch((updateListError) => {
                    reject(updateListError);
                });
            });
        });
    }
}